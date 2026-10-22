import { LEXUS_CAMERA_PRESETS, type LexusCameraViewId } from "./lexus-camera-presets";

// Phase 3 review cameras, converted from Blender Z-up to glTF Y-up.
// Source: blender/constants.py VIEWS. These inspect the two-node spike only.
export const SPIKE_CAMERA_PRESETS = {
  overview: { label: "Overview", target: [-0.03, 0.72, -0.04], position: [-0.03, 1.6, 2.45] },
  seat_front: { label: "Seat Front", target: [-0.25, 0.73, -0.2], position: [-0.25, 1.17, 1.7] },
  seat_detail: { label: "Seat Detail", target: [-0.25, 0.75, -0.2], position: [-0.6, 1.1, 0.6] },
  oled_front: { label: "OLED Front", target: [0.2, 0.8, 0.48], position: [0.2, 1.2, 1.0] },
  oled_profile: { label: "OLED Profile", target: [0.2, 0.8, 0.48], position: [0.55, 0.91, 0.65] },
} as const;

export type SpikeCameraViewId = keyof typeof SPIKE_CAMERA_PRESETS;
export type CameraViewId = SpikeCameraViewId | LexusCameraViewId;

export { LEXUS_CAMERA_PRESETS, type LexusCameraViewId };
