"""Render the DELIVERED GLB, not the pre-export scene. PROVISIONAL, unscored."""
import bpy
import hashlib
import json
import sys
import time
from pathlib import Path
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
import constants as C

asset = C.ROOT / "public/assets/3d/s-class-v223/spike.glb"
review = C.OUT / "review"
review.mkdir(exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(asset))
assert set(obj.name for obj in bpy.context.scene.objects) == {C.SEAT_NODE, C.OLED_NODE}
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = C.RENDER_SAMPLES
scene.cycles.seed = C.SEED
scene.cycles.time_limit = C.RENDER_LIMIT_SECONDS
scene.cycles.use_denoising = True
scene.render.threads_mode = "FIXED"
scene.render.threads = 4
scene.render.resolution_x, scene.render.resolution_y = C.RENDER_SIZE
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.use_stamp = True
scene.render.use_stamp_note = True
scene.render.stamp_note_text = "PROVISIONAL - S-Class V223 LWB - GATE-01/08/11 OPEN - unscored"
scene.render.stamp_font_size = 16
for field in ("date", "time", "render_time", "frame", "scene", "camera", "filename"):
    setattr(scene.render, "use_stamp_" + field, False)
scene.view_settings.view_transform = "AgX"
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.055, 0.065, 0.08, 1)
scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.4


def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


lights = [
    ("Key", (-1.3, -1.6, 2.6), 500, 1.6),
    ("Fill", (1.5, -0.4, 1.9), 220, 1.3),
    ("Rim", (-0.4, 1.5, 2.4), 650, 1.0),
]
for name, location, energy, size in lights:
    data = bpy.data.lights.new(name, type="AREA")
    data.energy, data.shape, data.size = energy, "DISK", size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    aim(obj, (-0.05, 0.05, 0.7))
camera_data = bpy.data.cameras.new("Review camera")
camera_data.type = "ORTHO"
camera = bpy.data.objects.new("Review camera", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
scales = [1.45, 1.12, 0.62, 0.48, 0.50]
report = {
    "status": C.LABEL, "source": str(asset.relative_to(C.ROOT)),
    "sha256": hashlib.sha256(asset.read_bytes()).hexdigest(),
    "renderer": "Cycles CPU; GPU/FPS/draw-call runtime NOT TESTED",
    "blender": bpy.app.version_string, "samples": C.RENDER_SAMPLES,
    "resolution": C.RENDER_SIZE, "threads": 4, "perRenderLimitSeconds": C.RENDER_LIMIT_SECONDS,
    "viewTransform": scene.view_settings.view_transform, "lights": lights, "views": [],
}
for (name, (location, target)), scale in zip(C.VIEWS.items(), scales):
    # Isolate each component for details, retaining both in the overview.
    bpy.data.objects[C.SEAT_NODE].hide_render = "oled" in name
    bpy.data.objects[C.OLED_NODE].hide_render = "seat" in name
    camera.location = location
    camera_data.ortho_scale = scale
    aim(camera, target)
    scene.render.filepath = str(review / (name + ".png"))
    started = time.perf_counter()
    bpy.ops.render.render(write_still=True)
    item = {"file": name + ".png", "seconds": time.perf_counter() - started,
            "location": location, "target": target, "orthoScale": scale,
            "visibleNodes": [n for n in (C.SEAT_NODE, C.OLED_NODE) if not bpy.data.objects[n].hide_render],
            "sha256": hashlib.sha256((review / (name + ".png")).read_bytes()).hexdigest()}
    report["views"].append(item)
    (review / "render-report.json").write_text(json.dumps(report, indent=2), encoding="utf8")
    print("SPIKE_RENDER " + json.dumps(item), flush=True)
print("SPIKE_REVIEW " + json.dumps(report), flush=True)
