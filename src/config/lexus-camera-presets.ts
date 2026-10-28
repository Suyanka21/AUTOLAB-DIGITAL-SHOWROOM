// Calibrated Lexus RX 350 review cameras, converted from Blender Z-up to glTF Y-up.
// Source: docs/LEXUS_DEMO_SCOPE_AND_ARCHITECTURE.md Section 6.
export const LEXUS_CAMERA_PRESETS = {
  hero_driver: {
    id: "hero_driver",
    label: "Driver Hero",
    sublabel: "Front 3/4 Ingress",
    focalTarget: "Full driver seat, headrest, outer bolster, and door ingress profile",
    target: [-0.38, 0.82, -0.05] as [number, number, number],
    position: [-1.45, 1.25, 0.95] as [number, number, number],
    fov: 38,
  },
  seam_macro: {
    id: "seam_macro",
    label: "Stitch Detail",
    sublabel: "Macro Seam & Flutes",
    focalTarget: "Cushion bolster transition, perforations, and contrast double-stitch seam",
    target: [-0.35, 0.62, 0.05] as [number, number, number],
    position: [-0.68, 0.85, 0.45] as [number, number, number],
    fov: 28,
  },
  cabin_pair: {
    id: "cabin_pair",
    label: "Cabin Pair",
    sublabel: "Front Cabin Width",
    focalTarget: "Wide cockpit perspective showing driver and passenger seats, console spacing, and steering wheel",
    target: [0.0, 0.76, 0.15] as [number, number, number],
    position: [0.0, 1.30, 1.85] as [number, number, number],
    fov: 45,
  },
  driver_cockpit: {
    id: "driver_cockpit",
    label: "Cockpit & Dash",
    sublabel: "Wheel & Instrument Display",
    focalTarget: "Eye-level perspective through driver door framing steering wheel, instrument cluster, and dashboard",
    target: [-0.30, 0.86, 0.38] as [number, number, number],
    position: [-1.00, 1.12, 0.05] as [number, number, number],
    fov: 42,
  },
} as const;

export type LexusCameraViewId = keyof typeof LEXUS_CAMERA_PRESETS;
