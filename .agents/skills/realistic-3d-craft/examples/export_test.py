import sys, os, math, bpy
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import craft_kit as ck
os.makedirs("out", exist_ok=True)
sc = ck.reset_scene()
panel, z = ck.flute_panel("Panel", res=(120, 160)); panel.data.materials.append(ck.leather_material("Leather", (0.22, 0.10, 0.055)))
ck.bevel_and_smooth(panel)
bpy.ops.object.select_all(action="DESELECT"); panel.select_set(True)
for draco in (False, True):
    out = f"out/panel_{'draco' if draco else 'plain'}.glb"
    args, skipped = ck.export_glb(out, draco=draco)
    print("EXPORT", out, os.path.getsize(out) // 1024, "KB | skipped args:", skipped)
print("draco-related params in this Blender:", [p for p in ck.gltf_export_params() if "draco" in p][:7])
