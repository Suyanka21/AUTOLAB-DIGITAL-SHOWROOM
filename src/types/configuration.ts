/**
 * AutoLab Digital Showroom
 * Configuration Engine Contracts
 *
 * Implements the frozen V1 flow:
 * Vehicle -> Material -> Colour -> Accent Thread -> Visual State -> Configuration Summary
 */

export type MaterialCategory = "leather" | "fabric" | "wood" | "carbon" | "metal" | "emissive";

export interface MaterialOption {
  id: string; // e.g. "nappa-exclusive"
  name: string; // "Exclusive Nappa Leather"
  category: MaterialCategory;
  description: string;
  isFactoryOEM: boolean;
  isAutoLabBespoke: boolean;
  roughness: number;
  metallic: number;
  clearcoat?: number;
  normalMapPath?: string;
  roughnessMapPath?: string;
  status: "approved" | "pending_autolab_approval" | "reference_only";
}

export interface ColorOption {
  id: string; // e.g. "sienna-brown-502a"
  name: string; // "Sienna Brown (502A)"
  hexCode: string; // "#7D4328"
  factoryCode?: string; // "502A"
  isFactoryOEM: boolean;
  isAutoLabBespoke: boolean;
  compatibleMaterialIds: string[];
  status: "approved" | "pending_autolab_approval";
}

export interface AccentThreadOption {
  id: string; // e.g. "contrast-champagne-gold"
  name: string; // "Champagne Gold Contrast"
  hexCode: string; // "#D4AF37"
  stitchPattern: "perimeter-single" | "diamond-quilted" | "double-lap" | "french-seam";
  status: "approved" | "pending_autolab_approval";
}

export interface AmbientLightOption {
  id: string;
  name: string;
  hexCode: string;
  intensityCdM2: number; // e.g. 1000 cd/m2
  factoryChannelCode?: number; // 1 to 64
}

export interface ZoneSelection {
  zoneId: string;
  materialId: string;
  colorId: string;
  accentThreadId?: string;
}

export interface ConfigurationState {
  referenceCode: string; // e.g. "AL-SC-2026-A8F2"
  vehicleId: string; // "mercedes-s-class-v223"
  createdAt: string;
  updatedAt: string;
  selections: {
    primaryUpholstery: ZoneSelection;
    secondaryAccent?: ZoneSelection;
    trimDeck: ZoneSelection;
    steeringWheel: ZoneSelection;
    ambientLighting?: {
      optionId: string;
      colorHex: string;
    };
  };
  notes?: string;
}

export interface ConfigurationSummary {
  referenceCode: string;
  vehicleTitle: string;
  vehicleChassis: string;
  primaryMaterial: string;
  primaryColor: string;
  secondaryMaterial?: string;
  secondaryColor?: string;
  trimFinish: string;
  accentStitching: string;
  ambientLightProfile?: string;
  customizationTier: "Factory OEM Equivalent" | "AutoLab Bespoke Transformation";
  timestamp: string;
}
