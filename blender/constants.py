"""PROVISIONAL V223 LWB spike; Blender 5.2.2 LTS; GATE-01/08/11 open.

Confirmed screen data: https://media.mbusa.com/news/the-new-mercedes-benz-s-class-2021
Provisional geometry: docs/spike/PHASE3_REFERENCE_HANDOFF.md sections 2–3.
All dimensions are metres. No parameter here claims measured seat geometry.
"""
from math import hypot, radians
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "blender/out"
SEAT_NODE = "GEO_Seat_Front_Driver_Flutes"
OLED_NODE = "GEO_Dashboard_Screen_Central_OLED"
SEAT_SLOT = "MAT_Upholstery_Primary"
OLED_SLOT = "MAT_Screen_Central_OLED"
LABEL = "PROVISIONAL: Mercedes-Benz S-Class V223 LWB; GATE-01/08/11 open"

# Manufacturer diagonal/resolution; derived assuming square pixels.
DISPLAY_DIAGONAL = 12.8 * 0.0254
DISPLAY_WIDTH = DISPLAY_DIAGONAL * 1728 / hypot(1728, 1888)
DISPLAY_HEIGHT = DISPLAY_DIAGONAL * 1888 / hypot(1728, 1888)
# Remaining dimensions are working estimates, not manufacturer specifications.
SCREEN_TILT = radians(38)
SCREEN_BORDER = 0.008
SCREEN_STRIP = 0.022
SCREEN_DEPTH = 0.008
SCREEN_RADIUS = 0.0015  # existing project specification, not physical measurement
SCREEN_STEP = 0.0008
SCREEN_POSITION = (0.20, -0.48, 0.80)  # isolated review layout, not installed location
SEAT_POSITION = (-0.25, 0.10, 0.45)  # provisional mounting datum
INSERT_WIDTH = 0.320  # 8 columns in central insert; excludes full seat envelope/bolsters
BASE_LENGTH = 0.440
BACK_LENGTH = 0.570
BACK_RECLINE = radians(22)
INSERT_THICKNESS = 0.028
FLUTE_COUNT = 8  # supplied pack layout; not independently verified as universal trim
FLUTE_DEPTH = 0.006
LOW_GRID = 32
HIGH_GRID = 192
TEXTURE_SIZE = 2048
BAKE_SAMPLES = 8
RENDER_SAMPLES = 24
RENDER_SIZE = (1200, 900)
RENDER_LIMIT_SECONDS = 280
SEED = 223

# Plan requests five views without coordinates. These operational choices cover both
# parts, seat normals, display face and bezel thickness using the same lighting.
VIEWS = {
    "01-overview": ((-0.03, -2.45, 1.60), (-0.03, 0.04, 0.72)),
    "02-seat-front": ((-0.25, -1.70, 1.17), (-0.25, 0.20, 0.73)),
    "03-seat-detail": ((-0.60, -0.60, 1.10), (-0.25, 0.20, 0.75)),
    "04-oled-front": ((0.20, -1.42, 1.54), SCREEN_POSITION),
    "05-oled-profile": ((0.80, -0.72, 0.99), SCREEN_POSITION),
}
