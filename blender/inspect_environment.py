"""Read-only Blender API probe; evidence goes to blender/out/."""
import bpy
import json
import sys
from pathlib import Path

out = Path(__file__).resolve().parent / "out"
out.mkdir(exist_ok=True)
props = bpy.ops.export_scene.gltf.get_rna_type().properties
data = {
    "version": bpy.app.version_string,
    "python": sys.version,
    "exportProperties": list(props.keys()),
    "exportOptions": {
        p.identifier: {
            "default": getattr(p, "default", None),
            "enum": [v.identifier for v in p.enum_items] if p.type == "ENUM" else None,
        } for p in props if any(s in p.identifier for s in
                               ["draco", "webp", "image", "selection", "active_scene", "tangent", "material", "light", "camera"])
    },
    "imageFormats": [v.identifier for v in bpy.types.ImageFormatSettings.bl_rna.properties["file_format"].enum_items],
}
(out / "environment.json").write_text(json.dumps(data, indent=2), encoding="utf8")
print(json.dumps(data, indent=2))
