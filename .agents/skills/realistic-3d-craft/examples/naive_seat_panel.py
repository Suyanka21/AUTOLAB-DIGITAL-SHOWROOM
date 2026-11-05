"""ANTI-PATTERN: what agents typically produce. Kept only as a before/after baseline. Do not copy."""
import math, os, bpy, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import craft_kit as ck
os.makedirs("out", exist_ok=True)
sc = ck.reset_scene(); ck.set_render(sc, 800, 533, 48, view="Standard")
mat, nt, b = ck.new_material("Flat"); ck.set_input(b, "Base Color", (0.22, 0.10, 0.055, 1)); ck.set_input(b, "Roughness", 0.5)
bpy.ops.mesh.primitive_cube_add(size=1); base = bpy.context.object; base.scale = (0.42, 0.55, 0.05); base.data.materials.append(mat)
for i in range(8):                      # raised box "flutes"
    bpy.ops.mesh.primitive_cube_add(size=1); r = bpy.context.object
    r.scale = (0.03, 0.46, 0.012); r.location = (-0.18 + i * 0.0515, -0.03, 0); r.data.materials.append(mat)
for o in bpy.data.objects:
    if o.type == "MESH": o.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.light_add(type="POINT", location=(-1.0, -1.4, 1.2)); bpy.context.object.data.energy = 600
bpy.context.scene.world = bpy.data.worlds.new("W"); bpy.context.scene.world.color = (0.25, 0.25, 0.25)
ck.add_camera(sc, (-0.55, -1.5, 0.4), (0, 0, 0.02), fstop=None)
ck.render_still(sc, "out/naive.png")
