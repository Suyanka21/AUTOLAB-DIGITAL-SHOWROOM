"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import materialsCatalogue from "../../config/materials/catalogue.json";
import colorsCatalogue from "../../config/materials/colors.json";
import threadsCatalogue from "../../config/materials/accent-threads.json";
import { buildWhatsAppHref } from "../whatsapp";
import type { CameraViewId } from "@/config/spike-camera-presets";

export type { CameraViewId } from "@/config/spike-camera-presets";
export type CompositionTier = "bespoke_monotone" | "bespoke_duotone" | "executive_fluted";
export type UpholsteryTreatment = "classic" | "diamond" | "perforated";

export interface ConfiguratorState {
  // Selections
  primaryColorId: string;
  primaryMaterialId: string;
  upholsteryTreatment: UpholsteryTreatment;
  compositionTier: CompositionTier;
  secondaryColorId: string;
  trimDeckId: string;
  accentThreadId: string;
  ambientLightHex: string;
  ambientLightName: string;
  activeCameraView: CameraViewId;
  referenceCode: string;

  // Setters
  setPrimaryColor: (colorId: string) => void;
  setUpholsteryTreatment: (treatment: UpholsteryTreatment) => void;
  setCompositionTier: (tier: CompositionTier) => void;
  setSecondaryColor: (colorId: string) => void;
  setTrimDeck: (trimId: string) => void;
  setAccentThread: (threadId: string) => void;
  setAmbientLight: (hex: string, name: string) => void;
  setActiveCameraView: (view: CameraViewId) => void;
  regenerateReferenceCode: () => void;

  // Computed Lookups
  selectedPrimaryColor: typeof colorsCatalogue[0];
  selectedPrimaryMaterial: typeof materialsCatalogue[0];
  selectedSecondaryColor: typeof colorsCatalogue[0];
  selectedTrimDeck: typeof materialsCatalogue[0];
  selectedAccentThread: typeof threadsCatalogue[0];
  
  // Helpers
  whatsAppHref: string | null;
}

const ConfiguratorContext = createContext<ConfiguratorState | null>(null);

export function generateRefCode(platform: "lexus" | "mercedes" = "lexus"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let hash = "";
  for (let i = 0; i < 4; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const prefix = platform === "mercedes" ? "AL-SC-2026" : "AL-RX-2026";
  return `${prefix}-${hash}`;
}

export function isLexusRefCode(code: string): boolean {
  return code.startsWith("AL-RX-");
}

export function ConfiguratorProvider({ children }: { children: React.ReactNode }) {
  const [primaryColorId, setPrimaryColorId] = useState<string>("sienna-brown-502a");
  const [primaryMaterialId, setPrimaryMaterialId] = useState<string>("nappa-exclusive");
  const [upholsteryTreatment, setUpholsteryTreatment] = useState<UpholsteryTreatment>("classic");
  const [compositionTier, setCompositionTier] = useState<CompositionTier>("bespoke_duotone");
  const [secondaryColorId, setSecondaryColorId] = useState<string>("black-nappa-501a");
  const [trimDeckId, setTrimDeckId] = useState<string>("open-pore-poplar");
  const [accentThreadId, setAccentThreadId] = useState<string>("contrast-champagne-gold");
  const [ambientLightHex, setAmbientLightHex] = useState<string>("#38B6FF"); // AutoLab Electric Cyan
  const [ambientLightName, setAmbientLightName] = useState<string>("AutoLab Electric Cyan");
  const [activeCameraView, setActiveCameraView] = useState<CameraViewId>("hero_driver");
  const [referenceCode, setReferenceCode] = useState<string>("AL-RX-2026-RX01");

  useEffect(() => {
    // Generate a unique reference code on client mount (defaulting to Lexus RX 350 prefix)
    const timer = setTimeout(() => setReferenceCode(generateRefCode("lexus")), 0);
    return () => clearTimeout(timer);
  }, []);

  const selectedPrimaryColor = useMemo(() => {
    return colorsCatalogue.find((c) => c.id === primaryColorId) || colorsCatalogue[1];
  }, [primaryColorId]);

  const selectedPrimaryMaterial = useMemo(() => {
    return materialsCatalogue.find((m) => m.id === primaryMaterialId) || materialsCatalogue[0];
  }, [primaryMaterialId]);

  const selectedSecondaryColor = useMemo(() => {
    return colorsCatalogue.find((c) => c.id === secondaryColorId) || colorsCatalogue[0];
  }, [secondaryColorId]);

  const selectedTrimDeck = useMemo(() => {
    return materialsCatalogue.find((m) => m.id === trimDeckId) || materialsCatalogue[2];
  }, [trimDeckId]);

  const selectedAccentThread = useMemo(() => {
    return threadsCatalogue.find((t) => t.id === accentThreadId) || threadsCatalogue[0];
  }, [accentThreadId]);

  const setPrimaryColor = (colorId: string) => {
    setPrimaryColorId(colorId);
    const color = colorsCatalogue.find((c) => c.id === colorId);
    if (color && color.compatibleMaterialIds.length > 0) {
      setPrimaryMaterialId(color.compatibleMaterialIds[0]);
    }
  };

  const regenerateReferenceCode = () => {
    setReferenceCode(generateRefCode());
  };

  const whatsAppHref = useMemo(() => {
    const compositionLabel =
      compositionTier === "bespoke_monotone"
        ? "Bespoke Monotone"
        : compositionTier === "bespoke_duotone"
        ? "Bespoke Duotone Bolsters"
        : "Executive Fluted & Armrest Split";

    const treatmentLabel =
      upholsteryTreatment === "diamond"
        ? "Diamond Quilted Mock-up"
        : upholsteryTreatment === "perforated"
        ? "Perforated Leather Mock-up"
        : "Classic Smooth";

    const text = [
      `*AutoLab Digital Showroom — Consultation Request*`,
      `• Reference Code: ${referenceCode}`,
      `• Vehicle: AutoLab Atelier Bespoke Interior`,
      ``,
      `*Curated Specification:*`,
      `• Primary Leather: ${selectedPrimaryColor?.name || primaryColorId}`,
      `• Upholstery Treatment: ${treatmentLabel}`,
      `• Interior Composition: ${compositionLabel}`,
      ...(compositionTier !== "bespoke_monotone" ? [`• Secondary Accent: ${selectedSecondaryColor?.name || secondaryColorId}`] : []),
      `• Trim Deck: ${selectedTrimDeck?.name || trimDeckId}`,
      `• Accent Thread: ${selectedAccentThread?.name || accentThreadId}`,
      `• Ambient Illumination: ${ambientLightName}`,
      ``,
      `I would like to book a bespoke consultation with an AutoLab Atelier Specialist.`
    ].join("\n");

    return buildWhatsAppHref(process.env.NEXT_PUBLIC_AUTOLAB_WHATSAPP_NUMBER, text);
  }, [
    referenceCode,
    selectedPrimaryColor,
    primaryColorId,
    upholsteryTreatment,
    compositionTier,
    selectedSecondaryColor,
    secondaryColorId,
    selectedTrimDeck,
    trimDeckId,
    selectedAccentThread,
    accentThreadId,
    ambientLightName,
  ]);

  return (
    <ConfiguratorContext.Provider
      value={{
        primaryColorId,
        primaryMaterialId,
        upholsteryTreatment,
        compositionTier,
        secondaryColorId,
        trimDeckId,
        accentThreadId,
        ambientLightHex,
        ambientLightName,
        activeCameraView,
        referenceCode,
        setPrimaryColor,
        setUpholsteryTreatment,
        setCompositionTier,
        setSecondaryColor: setSecondaryColorId,
        setTrimDeck: setTrimDeckId,
        setAccentThread: setAccentThreadId,
        setAmbientLight: (hex, name) => {
          setAmbientLightHex(hex);
          setAmbientLightName(name);
        },
        setActiveCameraView,
        regenerateReferenceCode,
        selectedPrimaryColor,
        selectedPrimaryMaterial,
        selectedSecondaryColor,
        selectedTrimDeck,
        selectedAccentThread,
        whatsAppHref,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error("useConfigurator must be used within a ConfiguratorProvider");
  }
  return context;
}
