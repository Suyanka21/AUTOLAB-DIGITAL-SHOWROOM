"""Blender 5.2.2 LTS: deterministic, headless two-node PROVISIONAL spike.

Sources:
https://docs.blender.org/manual/en/latest/render/cycles/baking.html
https://docs.blender.org/manual/en/5.3/addons/scene_gltf2.html
Actual exporter options are recorded by inspect_environment.py for installed 5.2.2.
All outputs stay in blender/out; scripts/finalize-spike.mjs packages the deliverable.
"""
import bpy
import hashlib
import json
import math
import sys
import time
from pathlib import Path
from mathutils import Vector, Matrix
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import constants as C

started = time.perf_counter()
C.OUT.mkdir(exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for mat in list(bpy.data.materials):
    bpy.data.materials.remove(mat)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1.0
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = C.BAKE_SAMPLES
scene.cycles.seed = C.SEED
scene.render.threads_mode = "FIXED"
scene.render.threads = 4
manifest = json.loads((C.ROOT / "src/config/scene-manifest.s-class-v223.json").read_text())
slots = {m["slotIdentifier"]: m for m in manifest["materialSlots"]}


def material(name, color):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = slots[name]["defaultRoughness"]
    bsdf.inputs["Metallic"].default_value = slots[name]["defaultMetallic"]
    bsdf.inputs["Coat Weight"].default_value = 0.05
    return m, bsdf


def image(name, array, noncolor=False):
    h, w = array.shape[:2]
    img = bpy.data.images.new(name, width=w, height=h, alpha=True)
    if noncolor:
        img.colorspace_settings.name = "Non-Color"
    img.pixels.foreach_set(array.astype(np.float32).ravel())
    img.filepath_raw = str(C.OUT / (name + ".png"))
    img.file_format = "PNG"
    img.save()
    return img


def texnode(mat, img):
    n = mat.node_tree.nodes.new("ShaderNodeTexImage")
    n.image = img
    return n


def surface(name, grid, detailed=False):
    vertices, faces, face_uvs = [], [], []
    # Build base and back contact surfaces as two islands in ONE mesh.
    for panel in range(2):
        offset = len(vertices)
        length = C.BASE_LENGTH if panel == 0 else C.BACK_LENGTH
        uv_left = 0.02 if panel == 0 else 0.52

        def point(i, j, bottom=False):
            u, v = i / grid, j / grid
            taper = (0.92 + 0.08 * math.sin(math.pi * v)) if panel == 0 else (0.88 + 0.12 * math.sin(math.pi * v))
            x = (u - 0.5) * C.INSERT_WIDTH * taper
            y = (v - 0.5) * length
            crown = 0.022 * math.sin(math.pi * u) * math.sin(math.pi * v)
            if panel:
                crown += 0.015 * math.exp(-((v - 0.27) / 0.20) ** 2) * math.sin(math.pi * u)
            z = -C.INSERT_THICKNESS if bottom else crown
            if detailed and not bottom:
                # Seven recessed boundaries define eight longitudinal flutes.
                seam = sum(math.exp(-((u - k / C.FLUTE_COUNT) / 0.012) ** 2) for k in range(1, C.FLUTE_COUNT))
                fade = min(1.0, v * 22, (1 - v) * 22) * math.sin(math.pi * u) ** 0.15
                z -= C.FLUTE_DEPTH * seam * fade
                z += 0.00016 * math.sin(i * 2.71 + j * 1.93) * math.sin(i * 0.77 - j * 2.31) * fade
            if panel == 0:
                return (x + C.SEAT_POSITION[0], -y + C.SEAT_POSITION[1], z + C.SEAT_POSITION[2])
            # surface normal faces toward the front of the seat (-Y).
            t = v * length
            return (x + C.SEAT_POSITION[0],
                    C.SEAT_POSITION[1] + C.BASE_LENGTH / 2 + t * math.sin(C.BACK_RECLINE) - z * math.cos(C.BACK_RECLINE),
                    C.SEAT_POSITION[2] + 0.015 + t * math.cos(C.BACK_RECLINE) + z * math.sin(C.BACK_RECLINE))

        for j in range(grid + 1):
            for i in range(grid + 1):
                vertices.append(point(i, j))
        def idx(i, j): return offset + j * (grid + 1) + i
        def uv(i, j): return (uv_left + 0.44 * i / grid, 0.16 + 0.82 * j / grid)
        for j in range(grid):
            for i in range(grid):
                # Base parameterization reverses Y, so reverse winding.
                indices = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
                if panel == 0:
                    indices.reverse()
                faces.append(tuple(idx(a, b) for a, b in indices))
                face_uvs.append([uv(a, b) for a, b in indices])
        if not detailed:
            edge = ([(i, 0) for i in range(grid)] + [(grid, j) for j in range(grid)] +
                    [(i, grid) for i in range(grid, 0, -1)] + [(0, j) for j in range(grid, 0, -1)])
            if panel == 0:
                edge.reverse()
            bottom_indices = []
            for i, j in edge:
                bottom_indices.append(len(vertices))
                vertices.append(point(i, j, True))
            for k, (i, j) in enumerate(edge):
                k2 = (k + 1) % len(edge)
                a, b = edge[k2]
                faces.append((idx(i, j), bottom_indices[k], bottom_indices[k2], idx(a, b)))
                lo, hi = uv_left + 0.44 * k / len(edge), uv_left + 0.44 * (k + 1) / len(edge)
                face_uvs.append([(lo, 0.12), (lo, 0.10), (hi, 0.10), (hi, 0.12)])
            faces.append(tuple(reversed(bottom_indices)))
            face_uvs.append([(uv_left + 0.44 * i / grid, 0.02 + 0.06 * j / grid) for i, j in reversed(edge)])
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for poly, uvs in zip(mesh.polygons, face_uvs):
        poly.use_smooth = poly.loop_total == 4
        for loop, coords in zip(poly.loop_indices, uvs):
            uv_layer.data[loop].uv = coords
    return obj


seat_mat, seat_bsdf = material(C.SEAT_SLOT, (0.23, 0.15, 0.09))
seat = surface(C.SEAT_NODE, C.LOW_GRID)
seat.data.materials.append(seat_mat)
high = surface("BAKE_SOURCE_NOT_EXPORTED", C.HIGH_GRID, True)
high.data.materials.append(seat_mat)
normal = bpy.data.images.new("seat-normal", width=C.TEXTURE_SIZE, height=C.TEXTURE_SIZE, alpha=False)
normal.colorspace_settings.name = "Non-Color"
normal.generated_color = (0.5, 0.5, 1, 1)
bake_node = texnode(seat_mat, normal)
seat_mat.node_tree.nodes.active = bake_node
bpy.ops.object.select_all(action="DESELECT")
high.select_set(True)
seat.select_set(True)
bpy.context.view_layer.objects.active = seat
scene.render.bake.use_selected_to_active = True
scene.render.bake.cage_extrusion = 0.012
scene.render.bake.max_ray_distance = 0.025
scene.render.bake.margin = 12
bake_start = time.perf_counter()
bpy.ops.object.bake(type="NORMAL", normal_space="TANGENT", use_clear=True)
bake_seconds = time.perf_counter() - bake_start
normal.filepath_raw = str(C.OUT / "seat-normal.png")
normal.file_format = "PNG"
normal.save()
bpy.data.objects.remove(high, do_unlink=True)
normal_node = seat_mat.node_tree.nodes.new("ShaderNodeNormalMap")
normal_node.inputs["Strength"].default_value = 1.0
seat_mat.node_tree.links.new(bake_node.outputs["Color"], normal_node.inputs["Color"])
seat_mat.node_tree.links.new(normal_node.outputs["Normal"], seat_bsdf.inputs["Normal"])

# Authored neutral leather swatch: seeded subtle variation, no photographic texture.
rng = np.random.default_rng(C.SEED)
pixels = np.ones((C.TEXTURE_SIZE, C.TEXTURE_SIZE, 4), dtype=np.float32)
noise = np.tile(rng.uniform(-0.004, 0.004, (128, 128)), (C.TEXTURE_SIZE // 128, C.TEXTURE_SIZE // 128))
for channel, color in enumerate((0.23, 0.15, 0.09)):
    pixels[:, :, channel] = color + noise
albedo = image("seat-albedo", pixels)
seat_mat.node_tree.links.new(texnode(seat_mat, albedo).outputs["Color"], seat_bsdf.inputs["Base Color"])
# ORM normalization: the glTF roughness factor supplies 0.48; blue metallic=0.
pixels[:, :, :3] = (1, 1, 0)
image("seat-orm", pixels, True)

# OLED: parametric rounded housing, stepped face and lower strip, all one slot/node.
oled_mat, oled_bsdf = material(C.OLED_SLOT, (0.015, 0.018, 0.023))
parts = []


def rounded_box(width, height, depth, radius, center):
    # Local XY screen plane, +Z front. Bevel changes are applied before joining.
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.dimensions = (width, height, depth)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new("Applied edge radius", "BEVEL")
    bevel.width = radius
    bevel.segments = 3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    bpy.ops.object.shade_auto_smooth()
    for modifier in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.materials.append(oled_mat)
    marker = obj.data.attributes.new("_ACTIVE_DISPLAY", "FLOAT", "POINT")
    for value in marker.data:
        value.value = 0
    parts.append(obj)
    return obj


outer_w = C.DISPLAY_WIDTH + 2 * C.SCREEN_BORDER
outer_h = C.DISPLAY_HEIGHT + 2 * C.SCREEN_BORDER + C.SCREEN_STRIP
rounded_box(outer_w, outer_h, C.SCREEN_DEPTH, C.SCREEN_RADIUS, (0, -C.SCREEN_STRIP / 2, -C.SCREEN_DEPTH / 2))
rounded_box(outer_w - 0.0016, outer_h - 0.0016, C.SCREEN_STEP, 0.00035, (0, -C.SCREEN_STRIP / 2, C.SCREEN_STEP / 2))
rounded_box(outer_w - 0.005, C.SCREEN_STRIP - 0.003, 0.002, 0.0008, (0, -C.DISPLAY_HEIGHT / 2 - C.SCREEN_BORDER - C.SCREEN_STRIP / 2, 0.001))
mesh = bpy.data.meshes.new("Active display face")
mesh.from_pydata([(-C.DISPLAY_WIDTH/2, -C.DISPLAY_HEIGHT/2, 0.001),
                  (C.DISPLAY_WIDTH/2, -C.DISPLAY_HEIGHT/2, 0.001),
                  (C.DISPLAY_WIDTH/2, C.DISPLAY_HEIGHT/2, 0.001),
                  (-C.DISPLAY_WIDTH/2, C.DISPLAY_HEIGHT/2, 0.001)], [], [(0, 1, 2, 3)])
face = bpy.data.objects.new("Active display face", mesh)
scene.collection.objects.link(face)
face.data.materials.append(oled_mat)
marker = mesh.attributes.new("_ACTIVE_DISPLAY", "FLOAT", "POINT")
for value in marker.data:
    value.value = 1
parts.append(face)
# Vertex colors distinguish the dark active face and rim without extra material slots.
for obj in parts:
    attr = obj.data.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="CORNER")
    color = (0.007, 0.012, 0.022, 1) if obj == face else (0.035, 0.038, 0.045, 1)
    for datum in attr.data:
        datum.color = color
color_node = oled_mat.node_tree.nodes.new("ShaderNodeVertexColor")
color_node.layer_name = "Color"
oled_mat.node_tree.links.new(color_node.outputs["Color"], oled_bsdf.inputs["Base Color"])
bpy.ops.object.select_all(action="DESELECT")
for obj in parts:
    obj.select_set(True)
bpy.context.view_layer.objects.active = face
bpy.ops.object.join()
oled = bpy.context.object
oled.name = C.OLED_NODE
oled.data.name = C.OLED_NODE
# Local screen Y maps upward/back; normal faces toward reviewer (-Y).
rotation = Matrix.Rotation(math.pi / 2 - C.SCREEN_TILT, 4, "X")
for vertex in oled.data.vertices:
    vertex.co = rotation @ vertex.co + Vector(C.SCREEN_POSITION)
oled.location = (0, 0, 0)
for obj in (seat, oled):
    obj["status"] = C.LABEL
    obj["dimensions"] = "PROVISIONAL except active OLED diagonal derived from manufacturer 12.8 inch"
    obj.select_set(True)
bpy.context.view_layer.objects.active = seat
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
# Tangent calculation cannot handle the underside n-gons. Apply triangulation
# after baking; preserve baked top-surface normals and UVs.
for obj in (seat, oled):
    bpy.context.view_layer.objects.active = obj
    triangulate = obj.modifiers.new("Applied export triangulation", "TRIANGULATE")
    bpy.ops.object.modifier_apply(modifier=triangulate.name)

counts = {}
for obj in (seat, oled):
    obj.data.calc_loop_triangles()
    counts[obj.name] = {"triangles": len(obj.data.loop_triangles), "vertices": len(obj.data.vertices),
                        "dimensionsMetres": list(obj.dimensions)}
assert set(o.name for o in scene.objects) == {C.SEAT_NODE, C.OLED_NODE}
assert counts[C.SEAT_NODE]["triangles"] <= 30000 and counts[C.OLED_NODE]["triangles"] <= 5000

export_args = dict(
    filepath=str(C.OUT / "spike-raw.glb"), export_format="GLB",
    use_selection=True, use_active_scene=True, export_yup=True, export_apply=True,
    export_cameras=False, export_lights=False, export_extras=True,
    export_animations=False, export_skins=False, export_morph=False,
    export_tangents=True, export_texcoords=True, export_attributes=True,
    export_vertex_color="ACTIVE", export_materials="EXPORT", export_image_format="AUTO",
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14, export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12, export_draco_generic_quantization=12,
)
available = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
assert all(key in available for key in export_args)
bpy.ops.export_scene.gltf(**export_args)
bpy.ops.wm.save_as_mainfile(filepath=str(C.OUT / "spike.blend"))
report = {
    "status": C.LABEL, "blender": bpy.app.version_string, "python": sys.version,
    "nodes": counts, "materials": [C.SEAT_SLOT, C.OLED_SLOT],
    "bakeSeconds": bake_seconds, "buildSeconds": time.perf_counter() - started,
    "activeDisplayWidthMm": C.DISPLAY_WIDTH * 1000, "activeDisplayHeightMm": C.DISPLAY_HEIGHT * 1000,
    "rawSha256": hashlib.sha256((C.OUT / "spike-raw.glb").read_bytes()).hexdigest(),
    "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
    "exportArguments": export_args,
}
(C.OUT / "build-report.json").write_text(json.dumps(report, indent=2), encoding="utf8")
print("SPIKE_BUILD " + json.dumps(report), flush=True)
