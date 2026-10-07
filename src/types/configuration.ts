/**
 * AutoLab Digital Showroom
 * Configuration Engine Contracts
 *
 * Implements the confirmed V1 flow:
 * Material -> Colour -> Accent Thread -> Interior Composition
 *
 * Clearly separates CONFIRMED requirements from PROPOSED / UNCONFIRMED options.
 */

export type MaterialCategory = "leather" | "fabric" | "wood" | "carbon" | "metal" | "emissive";

export type OptionApprovalStatus = 
  | "approved"                     // Formally approved by AutoLab stakeholder
  | "proposed_oem_reference"      // Research baseline from Mercedes-Benz order guides; pending AutoLab approval
  | "proposed_autolab_bespoke"    // Proposed custom AutoLab atelier option; pending AutoLab approval
  | "pending_autolab_approval"    // Awaiting physical hide/thread confirmation
  | "reference_only";             // 3D reference only; not offered to customers

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
  status: OptionApprovalStatus;
  approvalGate?: string; // e.g. "GATE-02"
  notes?: string;
}

export interface ColorOption {
  id: string; // e.g. "sienna-brown-502a"
  name: string; // "Sienna Brown (502A)"
  hexCode: string; // "#7D4328"
  factoryCode?: string; // "502A"
  isFactoryOEM: boolean;
  isAutoLabBespoke: boolean;
  compatibleMaterialIds: string[];
  status: OptionApprovalStatus;
  approvalGate?: string; // e.g. "GATE-03"
  notes?: string;
}

export interface AccentThreadOption {
  id: string; // e.g. "contrast-champagne-gold"
  name: string; // "Champagne Gold Contrast"
  hexCode: string; // "#D4AF37"
  stitchPattern: "perimeter-single" | "diamond-quilted" | "double-lap" | "french-seam";
  status: OptionApprovalStatus;
  approvalGate?: string; // e.g. "GATE-04"
  notes?: string;
}

export interface AmbientLightOption {
  id: string;
  name: string;
  hexCode: string;
  intensityCdM2: number; // e.g. 1000 cd/m2
  factoryChannelCode?: number; // 1 to 64
  status: OptionApprovalStatus;
  approvalGate?: string; // e.g. "GATE-05"
}

export interface ZoneSelection {
  zoneId: string;
  materialId: string;
  colorId: string;
  accentThreadId?: string;
}

/**
 * Confirmed V1 Configuration State
 * Mandatory Dimensions: Material -> Colour -> Accent Thread -> Interior Composition
 */
export interface ConfigurationState {
  referenceCode: string; // e.g. "AL-SC-2026-A8F2"
  vehicleId: string; // "mercedes-s-class-v223"
  createdAt: string;
  updatedAt: string;
  selections: {
    // 1. CONFIRMED V1 CORE: Material -> Colour -> Accent Thread -> Composition
    primaryMaterialId: string;       // Confirmed: Leather (or fabric where supported)
    primaryColorId: string;          // Proposed candidate, requires AutoLab approval
    accentThreadId: string;          // Proposed candidate, requires AutoLab approval
    interiorComposition: {
      tier: "bespoke_monotone" | "bespoke_duotone" | "executive_fluted";
      appliedZones: string[];        // Zones modified in this composition
    };
    // 2. PROPOSED / EXTENDED SELECTIONS (Only active if confirmed by AutoLab under Gate 5)
    extendedZones?: {
      secondaryAccentBolsters?: ZoneSelection;
      trimDeckVeneer?: ZoneSelection;
      steeringWheel?: ZoneSelection;
    };
    // 3. 3D VISUAL SETTINGS (Asset feature, unconfirmed as customer configuration dimension)
    ambientLightingPreset?: {
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
  materialCategory: string; // e.g. "Leather"
  primaryMaterialName: string;
  primaryColorName: string;
  accentThreadName: string;
  interiorCompositionTitle: string;
  customizationTier: "AutoLab Bespoke Atelier Transformation";
  approvalNotice: string; // Explicit disclaimer: "Colours and threads are proposed candidates subject to physical hide inspection at AutoLab."
  timestamp: string;
}
