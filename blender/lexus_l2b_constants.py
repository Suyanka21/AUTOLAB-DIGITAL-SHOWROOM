"""Provisional visual proportions from owner-supplied photos 29/33/35, not OEM measurements."""
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'blender/out/lexus-l2b-r1'
DRIVER_SHA = 'b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52'
WHEEL_CENTER = (-.38, -.395, .91)
WHEEL_RADIUS = .175
WHEEL_TUBE = .0175
WHEEL_TILT_DEGREES = 23
DASH_HALF_WIDTH = .75
DASH_FRONT_Y = -.55
DASH_REAR_Y = -.94
DASH_HEIGHT = .91
DISPLAY_CENTER = (.08, -.78, 1.017)
DISPLAY_SIZE = (.35, .035, .145)

# L2B-R1: relative contour landmarks, not physical measurements.
DASH_X_SECTIONS = [-.75,-.72,-.66,-.55,-.43,-.30,-.18,-.08,.04,.18,.30,.42,.54,.65,.72,.75]
COCKPIT_UV_REPEAT = 4.0
