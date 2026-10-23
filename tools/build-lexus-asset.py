"""Deterministic L2A authoring entrypoint: Blender 5.2.2 LTS / Python 3.13.

Run: blender -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py
Writes only blender/out/lexus-l2a. Photographs are never embedded.
Exporter: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
Installed exporter RNA is checked before export; no Mercedes geometry is reused.
"""
import bpy
import bmesh
import hashlib
import json
import math
import sys
import time
import numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "blender"))
import lexus_constants as C

started = time.perf_counter()
C.OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1.0
parts = []
stitch_vertices, stitch_faces = [], []


def save_image(name, rgb, color_space):
    image = bpy.data.images.new(name, width=C.TEX_SIZE, height=C.TEX_SIZE, alpha=True)
    image.colorspace_settings.name = color_space
    rgba = np.ones((C.TEX_SIZE, C.TEX_SIZE, 4), dtype=np.float32)
    rgba[:, :, :3] = rgb
    image.pixels.foreach_set(rgba.ravel())
    image.filepath_raw = str(C.OUT / (name + ".png"))
    image.file_format = "PNG"
    image.save()
    return image


def texture_set(perforated):
    # Analytically authored microrelief, not sampled from dealership photographs.
    # Tile repeats every 160 mm. Grain/pore scale is a disclosed approximation.
    n = C.TEX_SIZE
    rng = np.random.default_rng(C.SEED)
    yy, xx = np.mgrid[0:n, 0:n].astype(np.float32)
    noise = rng.random((n, n), dtype=np.float32)
    for _ in range(3):
        noise = (noise * 4 + np.roll(noise, 1, 0) + np.roll(noise, -1, 0)
                 + np.roll(noise, 1, 1) + np.roll(noise, -1, 1)) / 8
    height = (noise - .5) * .17
    height += .018 * np.sin(xx * .83 + np.sin(yy * .28)) * np.sin(yy * .71)
    pore = np.zeros((n, n), dtype=np.float32)
    if perforated:
        # Staggered fine pores: approximately 1.9 mm pitch, not measured.
        period = 12.0
        row = np.floor(yy / period)
        px = ((xx + (row % 2) * period / 2) % period) - period / 2
        py = (yy % period) - period / 2
        pore = np.exp(-(px * px + py * py) / 4.5)
        height -= .24 * pore
    dx = (np.roll(height, -1, 1) - np.roll(height, 1, 1)) * 1.4
    dy = (np.roll(height, -1, 0) - np.roll(height, 1, 0)) * 1.4
    normal = np.stack((-dx, -dy, np.ones_like(dx)), axis=2)
    normal /= np.linalg.norm(normal, axis=2)[:, :, None]
    normal = normal * .5 + .5
    base = np.clip(.77 + (noise - .5) * .10 - pore * .55, 0, 1)
    orm = np.stack((np.ones_like(base), .90 + noise * .10, np.zeros_like(base)), axis=2)
    prefix = "lexus-insert" if perforated else "lexus-bolster"
    return [save_image(prefix + "-base", np.repeat(base[:, :, None], 3, axis=2), "sRGB"),
            save_image(prefix + "-normal", normal, "Non-Color"),
            save_image(prefix + "-orm", orm, "Non-Color")]


materials = []
for index, name in enumerate(C.SLOTS):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Metallic"].default_value = 0
    bsdf.inputs["Roughness"].default_value = .35 if index == 2 else .48
    if index < 2:
        bsdf.inputs["Coat Weight"].default_value = .08
        bsdf.inputs["Coat Roughness"].default_value = .40
        base, normal, orm = texture_set(index == 0)
        for kind, image in (("base", base), ("normal", normal)):
            tex = material.node_tree.nodes.new("ShaderNodeTexImage")
            tex.image = image
            if kind == "normal":
                mapping = material.node_tree.nodes.new("ShaderNodeNormalMap")
                mapping.inputs["Strength"].default_value = .7
                material.node_tree.links.new(tex.outputs["Color"], mapping.inputs["Color"])
                material.node_tree.links.new(mapping.outputs["Normal"], bsdf.inputs["Normal"])
            else:
                material.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        # ORM and dark base factors are assigned with glTF Transform after export,
        # preserving exact manifest factors and a fully recolourable neutral map.
    else:
        bsdf.inputs["Base Color"].default_value = (.19, .20, .20, 1)
    materials.append(material)


def mesh_part(name, vertices, faces, material_indices=None, uvs=None):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    mesh.materials.append(materials[0])
    mesh.materials.append(materials[1])
    for p in mesh.polygons:
        p.use_smooth = True
        p.material_index = material_indices[p.index] if material_indices is not None else 1
    uv = mesh.uv_layers.new(name="UVMap")
    for loop in mesh.loops:
        v = mesh.vertices[loop.vertex_index].co
        uv.data[loop.index].uv = uvs[loop.vertex_index] if uvs else (v.x / C.TEX_TILE_METRES, (v.y + v.z) / C.TEX_TILE_METRES)
    parts.append(obj)
    return obj


def grid(name, func, nu, nv, selector, shell=None):
    verts, uv, faces, mids = [], [], [], []
    for j in range(nv + 1):
        for i in range(nu + 1):
            u, v = -1 + 2 * i / nu, j / nv
            p = func(u, v)
            verts.append(p)
            uv.append(((p[0] - C.SEAT_X) / C.TEX_TILE_METRES, v * .60 / C.TEX_TILE_METRES))
    for j in range(nv):
        for i in range(nu):
            a = j * (nu + 1) + i
            faces.append((a, a + 1, a + nu + 2, a + nu + 1))
            mids.append(selector(-1 + 2 * (i + .5) / nu, (j + .5) / nv))
    if shell:
        # Shared perimeter vertices eliminate cracks between independently sampled strips.
        perimeter = (list(range(nu+1)) + [j*(nu+1)+nu for j in range(1,nv+1)]
                     + [nv*(nu+1)+i for i in range(nu-1,-1,-1)]
                     + [j*(nu+1) for j in range(nv-1,0,-1)])
        previous=perimeter
        origin=[Vector(verts[i]) for i in perimeter]
        center=sum(origin,Vector())/len(origin)
        direction,depth=shell
        for ring in range(1,9):
            t=ring/8
            current=[]
            for p in origin:
                radial=p-center
                radial[direction]=0
                radial.normalize()
                # Soft return around the edge, shrinking into the rear/base shell.
                q=p+radial*(.012*math.sin(math.pi*t)-.012*t*t)
                q[direction]+=depth*(1-math.cos(t*math.pi/2))
                current.append(len(verts));verts.append(q)
                uv.append(((q.x-C.SEAT_X)/C.TEX_TILE_METRES,(q.y+q.z)/C.TEX_TILE_METRES))
            for i in range(len(perimeter)):
                j=(i+1)%len(perimeter)
                faces.append((previous[j],previous[i],current[i],current[j]));mids.append(1)
            previous=current
        # Back/base cap is deliberately plain: no invented mechanical details.
        center=sum((Vector(verts[i]) for i in previous),Vector())/len(previous)
        ci=len(verts);verts.append(center);uv.append((.5,.5))
        for i in range(len(previous)):
            faces.append((previous[(i+1)%len(previous)],previous[i],ci));mids.append(1)
    return mesh_part(name, verts, faces, mids, uv)


def bell(x, center, width):
    return math.exp(-((x - center) / width) ** 2)


def cushion(u, v):
    width = C.SEAT_WIDTH / 2 * (1 - .09 * v - .035 * math.cos(v * math.pi * 2)
                              - .07*bell(v,0,.075) - .05*bell(v,1,.075))
    x = C.SEAT_X + u * width
    y = C.CUSHION_FRONT + C.CUSHION_LENGTH * v + .032 * abs(u) ** 8 * math.cos(v * math.pi)
    # Foam dish with integrated rising side bolsters; shared continuous surface.
    z = C.CUSHION_TOP + .018 * math.cos(math.pi * v) + .010 * (1 - u*u)
    z += .047 * bell(abs(u), .80, .18) * (math.sin(math.pi * v) ** .35)
    z -= .011 * abs(u) ** 10
    if abs(u) < .64:
        z -= .0035 * (bell(v, .32, .014) + bell(v, .66, .014))
    z -= .0028 * bell(abs(u), .64, .016)
    return (x, y, z)


def back(u, v):
    # Smooth contour removes the planar bands of a linearly interpolated profile.
    width = .205 + .065*math.sin(math.pi*v)**.70 - .010*v
    x = C.SEAT_X + u * width
    z = C.BACK_BASE_Z + C.BACK_HEIGHT * v + .035 * (1-u*u) * v**6
    y = C.BACK_BASE_Y + C.BACK_RECLINE_OFFSET * v
    y -= .028 * (1-u*u) + .038 * bell(v, .22, .23) * (1-u*u)
    y -= .085 * bell(abs(u), .76, .24) * (math.sin(math.pi*v) ** .55)
    y += .0028 * bell(abs(u), .58, .018)
    # Upper arched panel junction and two restrained longitudinal channels.
    junction = .72 + .10 * (1-u*u)
    y += .003 * bell(v, junction, .012) * bell(u, 0, .65)
    y += .0015 * (bell(u, -.27, .015) + bell(u, .27, .015)) * (1-v)
    return (x, y, z)


cushion_mesh=grid("Cushion", cushion, 44, 48, lambda u,v: 0 if abs(u)<.64 and .05<v<.94 else 1, (2,-.095))
back_mesh=grid("Backrest", back, 44, 56, lambda u,v: 0 if abs(u)<.58 and .02<v<.95 else 1, (1,.085))


def rounded_box(name, location, dimensions, bevel, color=(1,1,1,1), segments=5):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = obj.modifiers.new("Soft tooling edges", "BEVEL")
    # Stay below the half-thickness limit: a fully clamped bevel produces zero-area faces.
    mod.width, mod.segments = min(bevel,min(dimensions)*.45), segments
    bpy.ops.object.modifier_apply(modifier=mod.name)
    for p in obj.data.polygons:
        p.use_smooth = True
    # Retain planar faces under smooth normals.
    weighted = obj.modifiers.new("Surface normals", "WEIGHTED_NORMAL")
    bpy.ops.object.modifier_apply(modifier=weighted.name)
    obj.data.materials.append(materials[1])
    attr = obj.data.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="CORNER")
    for datum in attr.data: datum.color = color
    parts.append(obj)
    return obj


# Only the photographed outer trim and switches; rails/motors excluded.
rounded_box("VisibleBaseSkirt", (C.SEAT_X, -.055, .365), (.50,.475,.11), .045, (.45,.45,.45,1))
rounded_box("ControlRecess", (C.SEAT_X-.253,-.07,.375), (.018,.265,.080), .018, (.25,.25,.25,1))
rounded_box("HorizontalSwitch", (C.SEAT_X-.267,-.13,.382), (.018,.105,.026), .009, (.70,.70,.70,1))
switch = rounded_box("BackrestSwitch", (C.SEAT_X-.267,-.030,.387), (.018,.027,.052), .010, (.65,.65,.65,1))
switch.rotation_euler.x = -.20
rounded_box("LumbarControl", (C.SEAT_X-.255,.070,.390), (.022,.046,.046), .020, (.60,.60,.60,1))


def headrest(theta,t):
    scale = max(.0001, math.sin(math.pi*t)) ** .20
    w = (.145-.040*t)*scale
    d = .065*scale
    cs, sn = math.cos(theta), math.sin(theta)
    x = C.SEAT_X + w * math.copysign(abs(cs)**.60,cs)
    y = .430-.035*t + d*math.copysign(abs(sn)**.60,sn)
    return (x,y,C.HEADREST_BOTTOM+C.HEADREST_HEIGHT*t)


verts,faces,uv = [],[],[]
nr,ns = 22,48
for j in range(nr+1):
    for i in range(ns):
        t=j/nr; angle=2*math.pi*i/ns
        verts.append(headrest(angle,t))
        uv.append((i/ns*1.4,t*1.6))
for j in range(nr):
    for i in range(ns):
        a=j*ns+i; b=j*ns+(i+1)%ns
        faces.append((a,b,b+ns,a+ns))
faces.append(tuple(reversed(range(ns))))
faces.append(tuple(nr*ns+i for i in range(ns)))
headrest_mesh=mesh_part("Headrest",verts,faces,uvs=uv)
for x in (-.067,.067):
    rounded_box("HeadrestPost", (C.SEAT_X+x,.425,1.135), (.010,.010,.060), .004, (.7,.7,.7,1), segments=3)


surface_trees={}
def stitch_path(points, offset=(0,0,0), surface=None):
    if surface:
        # Fit to the tessellated upholstery, not only its analytic ideal surface.
        # This prevents dashes disappearing below a groove between sampled vertices.
        if surface.name not in surface_trees:
            mesh=surface.data
            surface_trees[surface.name]=BVHTree.FromPolygons([v.co for v in mesh.vertices],
                                                           [tuple(p.vertices) for p in mesh.polygons])
        tree=surface_trees[surface.name]
        projected=[]
        for p in points:
            position,normal,_,distance=tree.find_nearest(Vector(p))
            assert position is not None and distance<.01
            projected.append(position+normal*Vector(offset).length)
        points=projected
    else:
        points=[Vector(p)+Vector(offset) for p in points]
    distances=[0.]
    for a,b in zip(points,points[1:]): distances.append(distances[-1]+(b-a).length)
    seg=0
    for distance in np.arange(.001,distances[-1]-.003,C.THREAD_PITCH):
        ends=[]
        for d in (distance,distance+C.THREAD_LENGTH):
            while seg < len(points)-2 and distances[seg+1] < d: seg+=1
            ratio=(d-distances[seg])/(distances[seg+1]-distances[seg])
            ends.append(points[seg].lerp(points[seg+1],ratio))
        a,b=ends
        axis=(b-a).normalized()
        normal=axis.cross(Vector((0,0,1)))
        if normal.length<.01: normal=axis.cross(Vector((0,1,0)))
        normal.normalize()
        binormal=axis.cross(normal).normalized()
        start=len(stitch_vertices)
        for end in (a,b):
            for k in range(4):
                theta=k*math.pi/2
                stitch_vertices.append(end+C.THREAD_RADIUS*(math.cos(theta)*normal+math.sin(theta)*binormal))
        for k in range(4):
            stitch_faces.append((start+k,start+(k+1)%4,start+(k+1)%4+4,start+k+4))
        # Ends enter the upholstery; omit invisible end caps, preserving pitch and diameter.


# Parallel rows follow the actual shaped surface, not floating straight lines.
for side in (-1,1):
    for delta in (-.010,.010):
        stitch_path([cushion(side*(.66+delta),v) for v in np.linspace(.035,.96,160)],(0,0,.00065),cushion_mesh)
        stitch_path([back(side*(.61+delta),v) for v in np.linspace(.02,.95,180)],(0,-.00065,0),back_mesh)
    # Outer cushion welt stitch seen at open driver door.
    stitch_path([cushion(side*.96,v) for v in np.linspace(.04,.96,150)],(0,0,.0006),cushion_mesh)
stitch_path([back(u,.72+.10*(1-u*u)) for u in np.linspace(-.57,.57,100)],(0,-.0006,0),back_mesh)
for v in (.32,.66):
    stitch_path([cushion(u,v+.008) for u in np.linspace(-.63,.63,100)],(0,0,.0006),cushion_mesh)
for side in (-1,1):
    angle = math.pi*1.15 if side==-1 else math.pi*1.85
    stitch_path([headrest(angle,t) for t in np.linspace(.08,.92,90)],(0,-.0007,0),headrest_mesh)

# Consolidate semantic material regions to two seat primitives plus one thread primitive.
bpy.ops.object.select_all(action="DESELECT")
for obj in parts: obj.select_set(True)
bpy.context.view_layer.objects.active=parts[0]
bpy.ops.object.join()
seat=bpy.context.object
seat.name=C.SEAT_NODE
seat.data.name=C.SEAT_NODE
stitches=mesh_part("Stitches",stitch_vertices,stitch_faces)
stitches.name=C.STITCH_NODE
stitches.data.name=C.STITCH_NODE
stitches.data.materials.clear()
stitches.data.materials.append(materials[2])
for p in stitches.data.polygons: p.material_index=0

for obj in (seat,stitches):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active=obj
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    bm=bmesh.new(); bm.from_mesh(obj.data)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    boundary_edges=sum(e.is_boundary for e in bm.edges)
    degenerate_faces=sum(f.calc_area()<1e-12 for f in bm.faces)
    if obj==seat:
        assert boundary_edges==0 and degenerate_faces==0, (boundary_edges,degenerate_faces)
        print("SEAT_INTEGRITY boundary_edges=0 degenerate_faces=0",flush=True)
    bm.to_mesh(obj.data); bm.free()
    tri=obj.modifiers.new("Export triangles","TRIANGULATE")
    bpy.ops.object.modifier_apply(modifier=tri.name)
    obj["status"]=C.LABEL
    obj["measurementStatus"]="All physical dimensions are visual estimates; no OEM CAD"

# Ensure all leather faces have white vertex tint; trim uses darker vertex tint.
if seat.data.color_attributes.get("Color"):
    attr=seat.data.color_attributes["Color"]
    for item in attr.data:
        if item.color[3] == 0: item.color=(1,1,1,1)

counts={}
for obj in (seat,stitches):
    obj.data.calc_loop_triangles()
    counts[obj.name]={"triangles":len(obj.data.loop_triangles),"vertices":len(obj.data.vertices),
                      "dimensionsMetres":list(obj.dimensions)}
    assert all(math.isfinite(v) for vertex in obj.data.vertices for v in vertex.co)

bpy.ops.object.select_all(action="DESELECT")
seat.select_set(True); stitches.select_set(True)
export_args=dict(filepath=str(C.OUT/"driver-seat-raw.glb"),export_format="GLB",
    use_selection=True,use_active_scene=True,export_yup=True,export_apply=True,
    export_cameras=False,export_lights=False,export_extras=True,export_animations=False,
    export_skins=False,export_morph=False,export_tangents=True,export_texcoords=True,
    export_vertex_color="ACTIVE",export_materials="EXPORT",export_image_format="AUTO",
    export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,
    export_draco_position_quantization=16,export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=14,export_draco_generic_quantization=12)
assert all(key in bpy.ops.export_scene.gltf.get_rna_type().properties.keys() for key in export_args)
bpy.ops.export_scene.gltf(**export_args)
bpy.ops.wm.save_as_mainfile(filepath=str(C.OUT/"driver-seat.blend"))
report={"status":C.LABEL,"blender":bpy.app.version_string,"python":sys.version,"nodes":counts,
    "buildSeconds":time.perf_counter()-started,"exportArguments":export_args,
    "sourceHashes":{str(p.relative_to(C.ROOT)):hashlib.sha256(p.read_bytes()).hexdigest()
                    for p in (Path(__file__),C.ROOT/"blender/lexus_constants.py")},
    "textureMethod":"Seeded analytic leather grain and perforation normal/ORM fields; no photo pixels",
    "materialNames":C.SLOTS}
(C.OUT/"build-report.json").write_text(json.dumps(report,indent=2),encoding="utf8")
print("LEXUS_BUILD "+json.dumps(report),flush=True)
