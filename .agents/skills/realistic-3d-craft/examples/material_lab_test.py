import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import craft_kit as ck
os.makedirs("out", exist_ok=True)
v = sys.argv[1]
rgb = (0.22, 0.10, 0.055)
cfg = {"A_current": dict(grain_per_m=900, grain_strength=0.55),
       "B_wider": dict(grain_per_m=700, grain_strength=1.2)}[v]
ck.material_lab(lambda: ck.leather_material("L", rgb, **cfg), f"out/lab_{v}.png")
