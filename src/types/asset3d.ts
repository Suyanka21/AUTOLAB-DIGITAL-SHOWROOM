/**
 * AutoLab Digital Showroom
 * 3D Asset Scene Graph and Specification Contracts
 *
 * Dictates the standardized Blender-to-WebGL scene graph hierarchy,
 * material slot mapping, priority tiers, and geometric tolerance boundaries.
 */

export type PriorityTier = "HIGH" | "MEDIUM" | "LOW";

export type GeometricTolerance = "EXACT" | "CONTROLLED_APPROX" | "APPROXIMATION";

export interface SceneNodeDefinition {
  sceneGraphIdentifier: string; // e.g. "GEO_Dashboard_Screen_Central_OLED"
  moduleName: "Dashboard" | "Steering" | "Seating" | "Console" | "DoorCards" | "Lighting" | "Peripheral";
  priorityTier: PriorityTier;
  tolerance: GeometricTolerance;
  materialSlotId?: string; // e.g. "MAT_Trim_Deck_Main"
  kinematic: boolean;
  kinematicDescription?: string;
  notes: string;
}

export interface MaterialSlotDefinition {
  slotIdentifier: string; // e.g. "MAT_Upholstery_Primary"
  targetZones: string[];
  shaderType: "pbr_metallic_roughness" | "emissive" | "glass" | "anisotropic";
  defaultRoughness: number;
  defaultMetallic: number;
  hasClearcoat: boolean;
  clearcoatRoughness?: number;
  hasNormalMap: boolean;
  textureResolutionBudget: "512" | "1024" | "2048";
}

export interface WebGLAssetBudget {
  maxTriangles: number;
  maxDrawCalls: number;
  maxGpuMemoryMb: number;
  maxFileSizeBytes: number; // e.g. 15MB uncompressed, 5MB Draco compressed
  targetFrameRateDesktop: number; // 60 fps
  targetFrameRateMobile: number; // 30-60 fps
}

export interface AssetValidationResult {
  passed: boolean;
  triangleCount: number;
  drawCallCount: number;
  fileSizeBytes: number;
  missingNodes: string[];
  unmappedMaterialSlots: string[];
  anonymizedBrandingVerified: boolean;
  evaluatedAt: string;
}
