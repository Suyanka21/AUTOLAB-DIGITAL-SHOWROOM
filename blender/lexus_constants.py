"""L2A visual estimates in metres; no OEM measurement claims.

Photo anchors: supplied LRX-08/23 (driver), LRX-29 (passenger-side comparison),
LRX-31 (rear context/shoulder seams, not a stitch macro).
Axes: Blender X lateral, -Y facing front, Z up; glTF export maps to Y-up.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "blender/out/lexus-l2a"
SEED = 22350
SEAT_X = -0.38
SEAT_WIDTH = 0.55
CUSHION_LENGTH = 0.50
CUSHION_FRONT = -0.30
CUSHION_TOP = 0.49
BACK_BASE_Z = 0.465
BACK_HEIGHT = 0.635
BACK_BASE_Y = 0.20
BACK_RECLINE_OFFSET = 0.20
HEADREST_BOTTOM = 1.155
HEADREST_HEIGHT = 0.255
THREAD_RADIUS = 0.00038
THREAD_PITCH = 0.0038
THREAD_LENGTH = 0.00245
TEX_SIZE = 1024
TEX_TILE_METRES = 0.16
SEAT_NODE = "GEO_Seat_Front_Driver"
STITCH_NODE = "GEO_Seat_Stitching_Front"
SLOTS = ("MAT_Seat_Primary", "MAT_Seat_Secondary", "MAT_Seat_Stitching")
LABEL = "PROVISIONAL Lexus RX 350 driver-seat visual prototype; owner approval pending"
