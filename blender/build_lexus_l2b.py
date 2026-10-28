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
        n.inputs['Strength'].default_value = .14 if stage == 'wheel' else .09
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

if stage == 'passenger':
    bpy.ops.import_scene.gltf(filepath=str(C.OUT/'passenger-seat-l2b-render.glb'))
    parts = [o for o in bpy.context.scene.objects if o.type=='MESH']
    # Derivation already performed on delivered GLB attributes by finalizer.
    # Save actual geometry as a Blender output without rebuilding the driver.
elif stage in ('wheel', 'dashboard'):
    leather = material('MAT_Steering_Leather' if stage=='wheel' else 'MAT_Dashboard_Trim', (.028,.032,.038), .45 if stage=='wheel' else .65, normal=True)
    accent = material('MAT_Cockpit_Accent',(.45,.47,.49),.30,.70)
    black = material('MAT_Cockpit_Black',(.008,.011,.016),.30)
    from lexus_l2b_cockpit import build_cockpit
    build_cockpit(stage, mesh, box, tube, leather, accent, black)

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
    # Finer cockpit grain; existing texture repeats, no new pattern or seat UV changes.
    for uv in obj.data.uv_layers.active.data: uv.uv *= C.COCKPIT_UV_REPEAT

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
    'driverSha256':C.DRIVER_SHA,'sourceHashes':{str(p.relative_to(C.ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (Path(__file__),C.ROOT/'blender/lexus_l2b_constants.py',C.ROOT/'blender/lexus_l2b_cockpit.py',C.ROOT/'blender/cockpit_surfaces.py')}}
(C.OUT/(stage+'-build.json')).write_text(json.dumps(report,indent=2),encoding='utf8')
print('L2B_BUILD '+json.dumps(report),flush=True)
