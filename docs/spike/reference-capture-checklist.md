# Reference Capture Checklist (owner task, about half a day)

Why: without ground truth of a real car, nobody can judge fidelity, and the spec's own dimensions marked ESTIMATED stay guesses. AutoLab works on real cars, so this is the cheapest high-value input in the whole project.

**Keep these files OUT of the git repository** (it may be public). Store them in a private folder and tell the agent the local path.

## 1. Which car
Photograph a real S-Class interior and record: generation, model year, trim, seat type (quilted or fluted), screen type. Record whether it is the generation AutoLab's customers actually own (decision D9).

## 2. Photo protocol
- Even daylight or soft indirect light. No flash. Switch off colour filters and HDR modes.
- Phone at 1x or 2x, level, on a tripod or steady surface. Landscape orientation.
- Name files `ref-<number>-<view>.jpg` and write the view list in a text file.

| View | Shots |
| :--- | :--- |
| Driver 3/4 from the rear door | 1 |
| Straight-on dashboard from the driver seat | 1 |
| Straight-on dashboard from the passenger side | 1 |
| Centre console from above | 1 |
| Front seats 3/4 from the door | 2 |
| Rear seats from the opposite door | 1 |
| Door card, driver side | 1 |
| Steering wheel, face-on | 1 |
| **Macro with a ruler in frame:** quilting, stitching, perforation, seam | 4 |
| Central screen, face-on and at an angle | 2 |

## 3. Measurements (tape measure, millimetres, written in a text file)
Screen active-area width and height; screen bezel width; steering wheel rim outer diameter; seat cushion width; seat back height; dash top to seat base; distance between the two front headrest centres; shut-gap width at a door card seam; stitch spacing and diamond pitch on the seat.

## 4. Physical samples (for GATE-03 and GATE-04)
For each approved leather colour and thread colour: photograph the sample on a grey card in daylight, and flatbed-scan flat samples at 600 dpi if possible. These decide whether the on-screen colours look honest to customers.

## 5. Done when
A folder with the photos, the view list, the measurement file and the sample photos exists, and you have recorded the path. GATE-11 covers this.
