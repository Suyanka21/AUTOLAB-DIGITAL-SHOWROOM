"""Render delivered geometry with decoded delivered KTX pixels, never the authoring scene."""
import bpy
import hashlib
import json
import math
import sys
import time
from pathlib import Path
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lexus_constants as C

args = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
round_id = args[0] if args else "round1"
review = C.OUT / "review" / round_id
review.mkdir(parents=True, exist_ok=True)
asset = C.ROOT / "public/assets/3d/lexus-rx350/driver-seat-l2a.glb"
finalize = json.loads((C.OUT / "finalize-report.json").read_text())
assert finalize["sha256"] == hashlib.sha256(asset.read_bytes()).hexdigest()
assert finalize["renderInputSha256"] == hashlib.sha256((C.OUT/finalize["renderInput"]).read_bytes()).hexdigest()
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(C.OUT / "driver-seat-render-decoded.glb"))
assert set(o.name for o in bpy.context.scene.objects) == {C.SEAT_NODE, C.STITCH_NODE}
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 32
scene.cycles.seed = C.SEED
scene.cycles.use_denoising = True
scene.cycles.time_limit = 160
scene.render.threads_mode = "FIXED"
scene.render.threads = 6
scene.render.resolution_x, scene.render.resolution_y = 1400, 1200
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "AgX"
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (.16,.17,.18,1)
scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = .35


def aim(obj, point):
    obj.rotation_euler = (Vector(point)-obj.location).to_track_quat("-Z","Y").to_euler()


lights = [("Key",(-1.6,-1.8,2.5),150,1.6),
          ("Fill",(1.0,-.6,1.7),70,1.5),
          ("Rim",(-.6,1.3,2.3),150,1.2)]
for name,loc,power,size in lights:
    light=bpy.data.lights.new(name,"AREA")
    light.energy,light.shape,light.size=power,"DISK",size
    obj=bpy.data.objects.new(name,light)
    scene.collection.objects.link(obj)
    obj.location=loc
    aim(obj,(C.SEAT_X,.04,.85))
# Presentation floor is not part of GLB and is not cabin geometry.
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,.295))
floor=bpy.context.object
floor.name="Review-only studio ground"
mat=bpy.data.materials.new("Review-only neutral grey")
mat.use_nodes=True
mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value=(.10,.11,.12,1)
mat.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value=.9
floor.data.materials.append(mat)
camdata=bpy.data.cameras.new("Review camera")
camdata.type="PERSP"
camdata.lens=55
camera=bpy.data.objects.new("Review camera",camdata)
scene.collection.objects.link(camera)
scene.camera=camera
# Dedicated one-seat framing; L3 application camera calibration is out of this phase.
views=[
    ("01-driver-hero",(-1.65,-1.95,1.55),(C.SEAT_X,.05,.86),55),
    ("02-open-door-profile",(-2.65,-.48,1.17),(C.SEAT_X,.07,.84),55),
    ("03-seam-macro",(-.93,-.72,.95),(-.57,-.12,.51),65),
]
report={"assetSha256":finalize["sha256"],"renderInput":finalize["renderInput"],
        "renderInputSha256":finalize["renderInputSha256"],
        "textureMethod":finalize["renderNote"],"blender":bpy.app.version_string,
        "renderer":"Cycles CPU; GPU memory and real-device FPS NOT MEASURED",
        "sampleLimit":32,"tracingTimeLimitSeconds":160,"achievedSamples":None,
        "samplingNote":"32 is the configured maximum, not a measured count; the time limit may stop tracing earlier. Achieved count is not exposed by this report.",
        "resolution":[1400,1200],"lights":lights,"views":[],"round":round_id}
for name,loc,target,lens in views:
    camera.location=loc;camdata.lens=lens;aim(camera,target)
    scene.render.filepath=str(review/(name+".png"))
    start=time.perf_counter()
    bpy.ops.render.render(write_still=True)
    item={"file":name+".png","seconds":time.perf_counter()-start,"location":loc,"target":target,"lensMm":lens,
          "sha256":hashlib.sha256((review/(name+".png")).read_bytes()).hexdigest()}
    report["views"].append(item)
    (review/"render-report.json").write_text(json.dumps(report,indent=2),encoding="utf8")
    print("LEXUS_RENDER "+json.dumps(item),flush=True)
