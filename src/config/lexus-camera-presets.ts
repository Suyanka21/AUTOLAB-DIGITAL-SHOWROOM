// Calibrated Lexus RX 350 review cameras, converted from Blender Z-up to glTF Y-up.
// Source: docs/LEXUS_DEMO_SCOPE_AND_ARCHITECTURE.md Section 6.
export const LEXUS_CAMERA_PRESETS = {
  hero_driver: {
    id: "hero_driver",
    label: "Driver Hero",
    sublabel: "Front 3/4 Ingress",
    focalTarget: "Full driver seat, headrest, outer bolster, and door ingress profile",
    target: [-0.38, 0.65, 0.10] as [number, number, number],
    position: [-1.2, 0.95, 0.85] as [number, number, number],
    fov: 38,
  },
  seam_macro: {
    id: "seam_macro",
    label: "Stitch Detail",
    sublabel: "Macro Seam & Flutes",
    focalTarget: "Cushion bolster transition, perforations, and contrast double-stitch seam",
    target: [-0.28, 0.55, 0.20] as [number, number, number],
    position: [-0.55, 0.75, 0.45] as [number, number, number],
    fov: 28,
  },
  cabin_pair: {
    id: "cabin_pair",
    label: "Cabin Pair",
    sublabel: "Front Cabin Width",
    focalTarget: "Wide cockpit view showing both front seats, console spacing, and steering wheel",
    target: [0.0, 0.70, 0.0] as [number, number, number],
    position: [0.0, 1.15, 1.25] as [number, number, number],
    fov: 45,
  },
  driver_cockpit: {
    id: "driver_cockpit",
    label: "Driver Ingress",
    sublabel: "Cockpit Perspective",
    focalTarget: "Eye-level perspective through open driver door showing steering wheel relationship and seat cushion base",
    target: [-0.35, 0.85, -0.15] as [number, number, number],
    position: [-0.95, 1.05, 0.15] as [number, number, number],
    fov: 42,
  },
} as const;

export type LexusCameraViewId = keyof typeof LEXUS_CAMERA_PRESETS;
