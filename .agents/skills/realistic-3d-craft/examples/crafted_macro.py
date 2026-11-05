"""Macro of the crafted panel: where the grain, stitching, piping and flute valley must hold up."""
import math, os, sys, bpy
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import craft_kit as ck
os.makedirs("out", exist_ok=True)
W, H = 0.42, 0.55
sc = ck.reset_scene(); ck.set_render(sc, 800, 533, 64, view="AgX")
panel, z = ck.flute_panel("Panel", w=W, h=H, flutes=8, bulge=0.018, res=(420, 560))
panel.data.materials.append(ck.leather_material("Leather", (0.22, 0.10, 0.055)))
ck.bevel_and_smooth(panel, width=0.0012, segments=3)
thread = ck.thread_material("Thread", (0.80, 0.74, 0.58))
parts = [ck.stitch_polyline("Stitch", ck.rect_path(W, H, 0.026), z, mat=thread),
         ck.piping("Piping", ck.rect_path(W, H, 0.004, 0.02), z, mat=ck.satin_material("Welt", (0.12, 0.055, 0.03), 0.5))]
for o in [panel] + parts: o.rotation_euler = (math.radians(90), 0, 0)
ck.studio_lighting(sc, target=(-0.17, -0.02, 0.23), scale=0.6)
ck.add_camera(sc, (-0.28, -0.42, 0.34), (-0.17, -0.02, 0.235), focal=100, fstop=4.0, focus=0.43)
ck.render_still(sc, "out/macro.png")
