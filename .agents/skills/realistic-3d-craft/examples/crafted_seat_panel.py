"""Worked example: a fluted, stitched, piped leather panel built with the realism layers. Adapt, do not paste."""
import math, os, sys, bpy
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import craft_kit as ck
os.makedirs("out", exist_ok=True)
W, H = 0.42, 0.55
sc = ck.reset_scene(); ck.set_render(sc, 800, 533, 48, view="AgX")
panel, z = ck.flute_panel("Panel", w=W, h=H, flutes=8, bulge=0.018, res=(260, 340))
panel.data.materials.append(ck.leather_material("Leather", (0.22, 0.10, 0.055)))
ck.bevel_and_smooth(panel, width=0.0012, segments=3)
thread = ck.thread_material("Thread", (0.80, 0.74, 0.58))
parts = [ck.stitch_polyline("Stitch", ck.rect_path(W, H, 0.026), z, mat=thread),
         ck.piping("Piping", ck.rect_path(W, H, 0.004, 0.02), z, mat=ck.satin_material("Welt", (0.12, 0.055, 0.03), 0.5))]
for o in [panel] + parts:
    o.rotation_euler = (math.radians(90), 0, 0)
ck.studio_lighting(sc)
ck.add_camera(sc, (-0.55, -1.5, 0.4), (0, 0, 0.02), focal=70, fstop=6.3)
ck.render_still(sc, "out/crafted.png")
