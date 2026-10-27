"""L2B extension to tools/build-lexus-asset.py. Blender 5.2.2 LTS.
All new surfaces are approximations. Input driver GLB is never modified.
Exporter options checked against installed RNA; reference manual:
https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
"""
import bpy
import bmesh
import sys
import json
import math
import hashlib
import time
from pathlib import Path
from mathutils import Vector
import lexus_l2b_constants as C

started = time.perf_counter()
stage = sys.argv[sys.argv.index('--l2b') + 1]
C.OUT.mkdir(parents=True, exist_ok=True)
assert hashlib.sha256((C.ROOT/'public/assets/3d/lexus-rx350/driver-seat-l2a.glb').read_bytes()).hexdigest() == C.DRIVER_SHA
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.context.scene.unit_settings.system = 'METRIC'
bpy.context.scene.unit_settings.scale_length = 1
parts = []

def material(name, color, rough, metal=0, normal=False):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if normal:
        tex = mat.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(str(C.OUT/'cockpit-normal.png'), check_existing=True)
        tex.image.colorspace_settings.name = 'Non-Color'
        n = mat.node_tree.nodes.new('ShaderNodeNormalMap')
        n.inputs['Strength'].default_value = .35
        mat.node_tree.links.new(tex.outputs['Color'], n.inputs['Color'])
        mat.node_tree.links.new(n.outputs['Normal'], bsdf.inputs['Normal'])
    return mat

def finish(obj, mat, smooth=True):
    obj.data.materials.clear(); obj.data.materials.append(mat)
    for p in obj.data.polygons: p.use_smooth = smooth
    parts.append(obj)
    return obj

def mesh(name, verts, faces, mat):
    data = bpy.data.meshes.new(name); data.from_pydata(verts, [], faces); data.update()
    obj = bpy.data.objects.new(name, data); bpy.context.collection.objects.link(obj)
    return finish(obj, mat)

def box(name, loc, size, mat, bevel=.006, rotation=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object; obj.name = name; obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        m = obj.modifiers.new('Edge radii', 'BEVEL'); m.width = min(bevel, min(size)*.40)
        # Tiny dashboard vent/trim bevels need one chamfer; reserve curvature for silhouettes.
        m.segments = 1 if stage=='dashboard' and min(size)<.015 else 3
        bpy.ops.object.modifier_apply(modifier=m.name)
    if rotation: obj.rotation_euler = rotation
    # Flat broad panels, smooth bevels through weighted normals.
    finish(obj, mat)
    m = obj.modifiers.new('Surface normals', 'WEIGHTED_NORMAL'); m.keep_sharp = True; m.weight = 50
    bpy.ops.object.modifier_apply(modifier=m.name)
    return obj

def tube(name, points, radius, mat, sides=8, closed=False):
    verts=[]; faces=[]; count=len(points)
    for i,p in enumerate(points):
        tangent = Vector(points[(i+1)%count])-Vector(points[(i-1)%count]) if closed else Vector(points[min(count-1,i+1)])-Vector(points[max(0,i-1)])
        tangent.normalize(); ref=Vector((0,1,0))
        if abs(tangent.dot(ref))>.95: ref=Vector((1,0,0))
        u=tangent.cross(ref).normalized(); v=tangent.cross(u)
        for k in range(sides): verts.append(Vector(p)+radius*(math.cos(k*math.tau/sides)*u+math.sin(k*math.tau/sides)*v))
    for i in range(count if closed else count-1):
        for j in range(sides): faces.append((i*sides+j,i*sides+(j+1)%sides,((i+1)%count)*sides+(j+1)%sides,((i+1)%count)*sides+j))
    if not closed: faces += [tuple(reversed(range(sides))),tuple((count-1)*sides+j for j in range(sides))]
    return mesh(name,verts,faces,mat)

tilt = math.radians(C.WHEEL_TILT_DEGREES)
def W(u,v,d=0):
    x,y,z=C.WHEEL_CENTER
    return (x+u,y-math.sin(tilt)*v+math.cos(tilt)*d,z+math.cos(tilt)*v+math.sin(tilt)*d)

if stage == 'passenger':
    bpy.ops.import_scene.gltf(filepath=str(C.OUT/'passenger-seat-l2b-render.glb'))
    parts = [o for o in bpy.context.scene.objects if o.type=='MESH']
    # Derivation already performed on delivered GLB attributes by finalizer.
    # Save actual geometry as a Blender output without rebuilding the driver.
elif stage in ('wheel', 'dashboard'):
    leather = material('MAT_Steering_Leather' if stage=='wheel' else 'MAT_Dashboard_Trim', (.028,.032,.038), .45 if stage=='wheel' else .65, normal=True)
    accent = material('MAT_Cockpit_Accent',(.45,.47,.49),.30,.70)
    black = material('MAT_Cockpit_Black',(.008,.011,.016),.30)
    if stage == 'wheel':
        # Slightly flattened bottom, thickened upper thumb grips; no hidden column.
        verts=[]; faces=[]; rings=120; sides=12
        for i in range(rings):
            a=i*math.tau/rings; r=C.WHEEL_RADIUS
            u=r*math.cos(a); v=max(-.165,r*math.sin(a))
            thick=C.WHEEL_TUBE+.005*math.exp(-((abs(u)-.15)/.035)**2-((v-.065)/.04)**2)
            for j in range(sides):
                b=j*math.tau/sides; verts.append(W(u+thick*math.cos(b)*math.cos(a),v+thick*math.cos(b)*math.sin(a),thick*math.sin(b)))
        for i in range(rings):
            for j in range(sides): faces.append((i*sides+j,((i+1)%rings)*sides+j,((i+1)%rings)*sides+(j+1)%sides,i*sides+(j+1)%sides))
        mesh('Leather rim',verts,faces,leather)
        rot=(math.pi/2+tilt,0,0)
        # Broad lateral spokes taper toward rim, silver edges around black pods.
        for side in (-1,1):
            box('Horizontal spoke',W(side*.108,-.018,-.004),(.108,.057,.045),leather,.012,rot)
            box('Spoke satin surround',W(side*.111,-.010,.023),(.102,.050,.006),accent,.003,rot)
            box('Control pod',W(side*.112,-.010,.028),(.086,.037,.009),black,.003,rot)
            for row in (-1,1):
                for col in (-1,1):
                    box('Button edge',W(side*.112+col*.018,-.010+row*.009,.034),(.027,.0015,.0015),accent,.0003,rot)
        box('Lower spoke',W(0,-.112,-.005),(.065,.105,.032),leather,.010,rot)
        box('Lower satin insert',W(0,-.115,.016),(.045,.078,.004),accent,.0015,rot)
        # Rounded shield hub, widest at upper shoulders; several rings for crown.
        verts=[]; faces=[]; levels=[(-.025,.85),(-.018,1),(.025,1),(.040,.90),(.044,.75)]
        for depth,scale in levels:
            for i in range(48):
                a=i*math.tau/48; u=.079*math.copysign(abs(math.cos(a))**.75,math.cos(a))*scale
                v=.076*math.copysign(abs(math.sin(a))**.8,math.sin(a))*scale
                u*=.88+.12*(v/.076+1)/2; verts.append(W(u,v-.015,depth))
        for r in range(len(levels)-1):
            for i in range(48): faces.append((r*48+i,r*48+(i+1)%48,(r+1)*48+(i+1)%48,(r+1)*48+i))
        faces += [tuple(reversed(range(48))),tuple((len(levels)-1)*48+i for i in range(48))]
        mesh('Airbag shield',verts,faces,leather)
        # Authored emblem outline, an approximation, no downloaded logo asset.
        tube('Emblem ellipse',[W(.028*math.cos(i*math.tau/48),.022*math.sin(i*math.tau/48),.046) for i in range(48)],.0018,accent,6,True)
        # Viewed from the seated side (+Y), screen-right is world -X.
        tube('Emblem L',[W(-.003,.017,.047),W(.008,-.013,.047),W(-.019,-.013,.047)],.0018,accent,6)
    else:
        # Contoured closed upper deck. Width, sweep and crown are visual estimates.
        verts=[]; faces=[]; nx=32; ny=12
        for layer in (0,1):
            for j in range(ny+1):
                t=j/ny
                for i in range(nx+1):
                    x=-C.DASH_HALF_WIDTH+2*C.DASH_HALF_WIDTH*i/nx
                    front=C.DASH_FRONT_Y-.055*(abs(x)/C.DASH_HALF_WIDTH)**2
                    y=front*(1-t)+C.DASH_REAR_Y*t
                    z=C.DASH_HEIGHT+.026*math.sin(math.pi*t)-.026*(abs(x)/C.DASH_HALF_WIDTH)**2-layer*.075
                    verts.append((x,y,z))
        stride=nx+1; layerSize=stride*(ny+1)
        for j in range(ny):
            for i in range(nx):
                a=j*stride+i;faces.append((a,a+1,a+1+stride,a+stride));faces.append(tuple(layerSize+k for k in (a+stride,a+1+stride,a+1,a)))
        rim=list(range(stride))+[j*stride+nx for j in range(1,ny+1)]+[ny*stride+i for i in range(nx-1,-1,-1)]+[j*stride for j in range(ny-1,0,-1)]
        for a,b in zip(rim,rim[1:]+rim[:1]):faces.append((a,b,b+layerSize,a+layerSize))
        mesh('Upper deck sweep',verts,faces,leather)
        # Driver binnacle hood, open face with closed thick roof, no hidden instrumentation.
        verts=[];faces=[];segments=32
        for y in (-.545,-.765):
            for radius in (1,.91):
                for i in range(segments+1):
                    a=math.pi*i/segments
                    verts.append((-.38+.245*radius*math.cos(a),y,.875+.155*radius*math.sin(a)))
        n=segments+1
        for i in range(segments):
            faces += [(i,i+1,2*n+i+1,2*n+i),(n+i,3*n+i,3*n+i+1,n+i+1),(i,n+i,n+i+1,i+1),(2*n+i,2*n+i+1,3*n+i+1,3*n+i)]
        faces += [(0,2*n,3*n,n),(segments,n+segments,3*n+segments,2*n+segments)]
        mesh('Instrument hood',verts,faces,leather)
        box('Cluster dark face',(-.38,-.605,.923),(.430,.014,.142),black,.006)
        for x in (-.48,-.28):
            tube('Gauge ring',[(x+.066*math.cos(a*math.tau/48),-.594,.925+.066*math.sin(a*math.tau/48)) for a in range(48)],.0018,accent,6,True)
            tube('Gauge needle',[(x,-.590,.925),(x-.036,-.590,.887)],.001,accent,5)
        box('Display plinth',(.08,-.77,.936),(.42,.19,.023),leather,.008)
        box('Widescreen housing',C.DISPLAY_CENTER,C.DISPLAY_SIZE,black,.012)
        box('Display inactive glass',(.08,-.760,C.DISPLAY_CENTER[2]),(.315,.003,.114),black,.001)
        # A restrained neutral screen, no invented navigation graphics/photo pixels.
        box('Central vent fascia',(.08,-.524,.813),(.51,.045,.139),black,.010)
        for x in (-.065,.225):
            for i in range(5):box('Vent vane',(x,-.497,.775+i*.018),(.206,.012,.003),black,.001)
            box('Vent tab',(x,-.488,.809),(.030,.008,.005),accent,.0015)
        tube('Clock bezel',[(.08+.042*math.cos(a*math.tau/48),-.492,.814+.042*math.sin(a*math.tau/48)) for a in range(48)],.003,accent,8,True)
        box('Clock face',(.08,-.499,.814),(.074,.006,.074),black,.002)
        for i in range(12):
            a=i*math.tau/12
            tube('Clock tick',[(.08+.031*math.cos(a),-.485,.814+.031*math.sin(a)),(.08+.036*math.cos(a),-.485,.814+.036*math.sin(a))],.0008,accent,4)
        tube('Clock hands',[(.063,-.482,.827),(.08,-.482,.814),(.084,-.482,.785)],.001,accent,5)
        # Asymmetric satin trim flows across upper stack and passenger side.
        tube('Upper satin sweep',[(-.135,-.515,.891),(.08,-.510,.896),(.32,-.532,.886),(.40,-.545,.854),(.61,-.557,.867),(.71,-.575,.884)],.007,accent,8)
        box('Passenger fascia',(.52,-.560,.812),(.41,.045,.091),leather,.012)
        box('Passenger vent recess',(.595,-.531,.822),(.195,.016,.046),black,.005)
        for i in range(3):box('Passenger vent vane',(.595,-.520,.808+i*.013),(.175,.010,.0025),black,.0008)
        tube('Passenger satin underline',[(.34,-.531,.797),(.41,-.530,.783),(.63,-.529,.783),(.70,-.544,.797)],.004,accent,8)
        # Only upper center stack edge; no console, floor or lower hidden HVAC.
        box('Upper stack termination',(.08,-.530,.720),(.47,.045,.050),leather,.008)

    # Shared materials consolidate each component to three primitives.
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join()
    obj=bpy.context.object;obj.name='GEO_SteeringWheel_Lexus' if stage=='wheel' else 'GEO_Dashboard_Lexus'
    obj.data.name=obj.name;parts=[obj]
    # Smart UV charts for these surfaces; tiled normal detail, not an atlas for logos.
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.015)
    bpy.ops.object.mode_set(mode='OBJECT')

counts={}
for obj in parts:
    bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    bm=bmesh.new();bm.from_mesh(obj.data)
    # Imported seat has split vertices at UV/material edges; do not weld or remodel it.
    if stage!='passenger':bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    degenerate=sum(f.calc_area()<1e-14 for f in bm.faces)
    boundary=sum(e.is_boundary for e in bm.edges)
    assert degenerate==0,(obj.name,degenerate)
    if stage!='passenger':assert boundary==0,(obj.name,boundary)
    bm.to_mesh(obj.data);bm.free()
    if stage!='passenger':
        tri=obj.modifiers.new('Explicit export triangulation','TRIANGULATE')
        bpy.ops.object.modifier_apply(modifier=tri.name)
    assert all(math.isfinite(v) for vertex in obj.data.vertices for v in vertex.co)
    obj.data.calc_loop_triangles()
    counts[obj.name]={'triangles':len(obj.data.loop_triangles),'dimensionsMetres':list(obj.dimensions),'boundaryEdges':boundary,'degenerateFaces':degenerate}
    obj['measurementStatus']='Provisional photo-based dimensions; not manufacturer specifications'

bpy.ops.object.select_all(action='DESELECT')
for obj in parts:obj.select_set(True)
if stage!='passenger':
    args=dict(filepath=str(C.OUT/(stage+'-raw.glb')),export_format='GLB',use_selection=True,use_active_scene=True,
        export_yup=True,export_apply=True,export_cameras=False,export_lights=False,export_extras=True,export_animations=False,
        export_skins=False,export_morph=False,export_tangents=True,export_texcoords=True,export_materials='EXPORT',
        export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,
        export_draco_position_quantization=16,export_draco_normal_quantization=10,export_draco_texcoord_quantization=14,export_draco_generic_quantization=12)
    assert all(k in bpy.ops.export_scene.gltf.get_rna_type().properties.keys() for k in args)
    bpy.ops.export_scene.gltf(**args)
bpy.ops.wm.save_as_mainfile(filepath=str(C.OUT/(stage+'.blend')))
report={'stage':stage,'blender':bpy.app.version_string,'python':sys.version,'nodes':counts,'seconds':time.perf_counter()-started,
    'driverSha256':C.DRIVER_SHA,'sourceHashes':{str(p.relative_to(C.ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (Path(__file__),C.ROOT/'blender/lexus_l2b_constants.py')}}
(C.OUT/(stage+'-build.json')).write_text(json.dumps(report,indent=2),encoding='utf8')
print('L2B_BUILD '+json.dumps(report),flush=True)
