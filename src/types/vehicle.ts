/**
 * AutoLab Digital Showroom
 * Vehicle Abstraction Contracts
 *
 * Designed to support the Mercedes-Benz S-Class V223 as the baseline vehicle,
 * while allowing predictable expansion for future vehicles (e.g., Range Rover, Toyota Hilux)
 * without application restructuring.
 */

export type VehicleGenerationStatus = "active" | "planned" | "archived";

export interface VehicleDimensions {
  wheelbaseMm: number;
  overallLengthMm: number;
  overallWidthMm: number;
  overallHeightMm: number;
  frontHeadroomMm: number;
  rearHeadroomMm: number;
  frontLegroomMm: number;
  rearLegroomMm: number;
}

export interface CameraPreset {
  id: string;
  name: string;
  description: string;
  targetNodeId?: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  minDistance?: number;
  maxDistance?: number;
}

export interface MaterialZoneSlot {
  zoneId: string;
  name: string;
  description: string;
  targetMeshPrefixes: string[];
  allowedMaterialTypes: Array<"leather" | "fabric" | "wood" | "carbon" | "metal" | "emissive">;
  defaultMaterialId: string;
  defaultColorId: string;
  defaultAccentThreadId?: string;
}

export interface VehicleDefinition {
  id: string; // e.g. "mercedes-s-class-v223"
  brand: string; // "Mercedes-Benz"
  model: string; // "S-Class"
  generation: string; // "Seventh Generation (V223 LWB)"
  modelYears: string; // "2021-2025"
  chassisCode: "W223" | "V223" | "Z223" | string;
  status: VehicleGenerationStatus;
  dimensions: VehicleDimensions;
  assetSource: {
    modelFile: string; // "assets/3d/s-class-v223/interior.glb"
    lodLowFile?: string;
    dracoCompressed: boolean;
    ktx2Textures: boolean;
  };
  materialZones: MaterialZoneSlot[];
  cameraPresets: CameraPreset[];
  metadata: {
    sourceBrief: string;
    evidenceConfidence: "CONFIRMED" | "ESTIMATED" | "UNKNOWN";
    notes: string;
  };
}
