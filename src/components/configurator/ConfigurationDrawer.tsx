"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Check,
  ChevronRight,
  Sliders,
  Layers,
  Palette,
  Scissors,
  Flame,
  RotateCcw,
  AlertTriangle,
  Info,
  ChevronDown,
} from "lucide-react";
import { useConfigurator, CompositionTier } from "@/lib/state/configurator-context";
import colorsCatalogue from "@/config/materials/colors.json";
import materialsCatalogue from "@/config/materials/catalogue.json";
import threadsCatalogue from "@/config/materials/accent-threads.json";

export function ConfigurationDrawer() {
  const {
    primaryColorId,
    setPrimaryColor,
    primaryMaterialId,
    compositionTier,
    setCompositionTier,
    secondaryColorId,
    setSecondaryColor,
    trimDeckId,
    setTrimDeck,
    accentThreadId,
    setAccentThread,
    ambientLightHex,
    setAmbientLight,
    selectedPrimaryColor,
    selectedPrimaryMaterial,
    selectedTrimDeck,
    selectedAccentThread,
  } = useConfigurator();

  // Confirmed V1 Steps: 1. Material -> 2. Colour -> 3. Accent Thread -> 4. Composition
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showExtendedProposed, setShowExtendedProposed] = useState<boolean>(false);

  // 1. Material Substrates
  const materialSubstrates = materialsCatalogue.filter(
    (m) => m.category === "leather"
  );

  // 2. Candidate Hide Colours (filter by compatible substrate)
  const candidateColors = colorsCatalogue.filter((c) =>
    c.compatibleMaterialIds.includes(primaryMaterialId)
  );

  // 3. Accent Threads
  const accentThreads = threadsCatalogue;

  // 4. Interior Compositions
  const compositionOptions = [
    {
      tier: "bespoke_monotone" as CompositionTier,
      name: "Bespoke Monotone",
      description: "Continuous uniform hide across seat cushions, bolsters, and console.",
      detail: "Clean single-tone elegance adhering to classic executive luxury.",
    },
    {
      tier: "bespoke_duotone" as CompositionTier,
      name: "Bespoke Duotone Bolsters",
      description: "Contrasting outer seat bolsters and headrest sides.",
      detail: "Sculptural two-tone contrast emphasizing multicontour seat architecture.",
    },
    {
      tier: "executive_fluted" as CompositionTier,
      name: "Executive Fluted & Armrest Split",
      description: "Contrasting center armrests, console knee pads, and central seat flutes.",
      detail: "Highest tier atelier composition with tailored visual division.",
    },
  ];

  // Secondary hide candidates for duotone
  const secondaryColors = colorsCatalogue.filter((c) =>
    c.compatibleMaterialIds.includes("nappa-exclusive") ||
    c.compatibleMaterialIds.includes("autolab-heritage-hide")
  );

  // Proposed Extended Options (Trim Deck & Ambient)
  const trimDeckMaterials = materialsCatalogue.filter(
    (m) => m.category === "wood" || m.category === "carbon"
  );

  const ambientPresets = [
    { hex: "#38B6FF", name: "AutoLab Electric Cyan", label: "Cyan Signature" },
    { hex: "#FF5722", name: "Sunset Amber Ambient", label: "Sunset Amber" },
    { hex: "#E91E63", name: "Miami Rose Ambient", label: "Miami Rose" },
    { hex: "#00BCD4", name: "Ocean Blue Ambient", label: "Ocean Blue" },
    { hex: "#D4AF37", name: "Champagne Luminescence", label: "Champagne Glow" },
  ];

  return (
    <div className="flex flex-col w-full rounded-2xl bg-[#141416] border border-white/[0.08] shadow-2xl overflow-hidden">
      {/* Pre-Production Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center space-x-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
        <p className="text-[11px] text-amber-200/90 leading-tight">
          <span className="font-semibold text-amber-300">Showcase Interaction Scaffold:</span>{" "}
          Options shown are proposed candidates demonstrating UI architecture. Not AutoLab-approved commercial catalogue items.
        </p>
      </div>

      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#16171B]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-[#38B6FF]" />
            <h2 className="text-base font-semibold tracking-wide text-white">
              V1 Configurator Sequence
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#38B6FF] bg-[#38B6FF]/10 px-2.5 py-1 rounded border border-[#38B6FF]/20">
            Confirmed Step {activeStep} of 4
          </span>
        </div>

        {/* 4-Step Navigation Tabs (Material -> Colour -> Accent Thread -> Composition) */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
          {[
            { step: 1, title: "1. Material", icon: Sparkles },
            { step: 2, title: "2. Colour", icon: Palette },
            { step: 3, title: "3. Thread", icon: Scissors },
            { step: 4, title: "4. Compose", icon: Layers },
          ].map(({ step, title, icon: Icon }) => {
            const isActive = activeStep === step;
            return (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`py-2 px-1 sm:px-2 rounded-lg text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  isActive
                    ? "bg-[#1C1E24] text-white border border-[#38B6FF]/50 shadow-[0_0_12px_rgba(56,182,255,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#38B6FF]" : "text-slate-500"}`} />
                <span className="truncate">{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[500px] space-y-6">
        {/* STEP 1: MATERIAL (LEATHER SUBSTRATE) */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-white/[0.05] text-[#38B6FF] px-2 py-0.5 rounded">
                  Confirmed V1 Dimension 1
                </span>
                <span className="text-[11px] text-slate-400">Gate 2 Evaluation</span>
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide mt-1">
                Primary Leather Material Substrate
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select the baseline hide grain and tanning standard for all primary touchpoints.
              </p>
            </div>

            <div className="space-y-3">
              {materialSubstrates.map((mat) => {
                const isSelected = primaryMaterialId === mat.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => {
                      // pick first compatible color
                      const compatible = colorsCatalogue.find((c) =>
                        c.compatibleMaterialIds.includes(mat.id)
                      );
                      if (compatible) {
                        setPrimaryColor(compatible.id);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 ${
                      isSelected
                        ? "bg-[#1A1D24] border-[#38B6FF] shadow-[0_0_15px_rgba(56,182,255,0.2)] ring-1 ring-[#38B6FF]"
                        : "bg-[#18191D] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#1C1D22]"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-[#38B6FF] bg-[#38B6FF]"
                            : "border-slate-600 bg-transparent"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-black font-bold" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-white">
                          {mat.name}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          Proposed (Gate 2)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{mat.description}</p>
                      <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono text-slate-500">
                        <span>Roughness: {mat.roughness}</span>
                        <span>•</span>
                        <span>Metallic: {mat.metallic}</span>
                        <span>•</span>
                        <span>{mat.isAutoLabBespoke ? "AutoLab Bespoke" : "OEM Reference"}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: COLOUR (CANDIDATE LEATHER HUES) */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-white/[0.05] text-[#38B6FF] px-2 py-0.5 rounded">
                  Confirmed V1 Dimension 2
                </span>
                <span className="text-[11px] text-slate-400">Proposed Candidates (Gate 3)</span>
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide mt-1">
                Candidate Hide Colour Palette
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Candidate hues awaiting AutoLab physical hide verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidateColors.map((color) => {
                const isSelected = primaryColorId === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setPrimaryColor(color.id)}
                    className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 ${
                      isSelected
                        ? "bg-[#1A1D24] border-[#38B6FF] shadow-[0_0_15px_rgba(56,182,255,0.2)] ring-1 ring-[#38B6FF]"
                        : "bg-[#18191D] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#1C1D22]"
                    }`}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className="h-9 w-9 rounded-full border border-white/20 shadow-md transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: color.hexCode }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-[1px]">
                          <Check className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-white truncate">
                          {color.name}
                        </span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.06]">
                          Proposed
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {color.notes || "Tailored luxury automotive hide."}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: ACCENT THREAD (STITCHING & TAILORING) */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-white/[0.05] text-[#38B6FF] px-2 py-0.5 rounded">
                  Confirmed V1 Dimension 3
                </span>
                <span className="text-[11px] text-slate-400">Proposed Candidates (Gate 4)</span>
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide mt-1">
                Accent Thread & Stitch Pattern
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Candidate high-tensile contrast threads awaiting workshop machine confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accentThreads.map((thread) => {
                const isSelected = accentThreadId === thread.id;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setAccentThread(thread.id)}
                    className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 ${
                      isSelected
                        ? "bg-[#1A1D24] border-[#38B6FF] shadow-[0_0_15px_rgba(56,182,255,0.2)] ring-1 ring-[#38B6FF]"
                        : "bg-[#18191D] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#1C1D22]"
                    }`}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className="h-9 w-9 rounded-full border border-white/20 shadow-md flex items-center justify-center"
                        style={{ backgroundColor: "#17181D" }}
                      >
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: thread.hexCode }}
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-white truncate">
                          {thread.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          Proposed
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                          {thread.stitchPattern}
                        </span>
                        <span className="text-[10px] font-mono text-[#38B6FF]">
                          {thread.hexCode}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: INTERIOR COMPOSITION */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-white/[0.05] text-[#38B6FF] px-2 py-0.5 rounded">
                  Confirmed V1 Dimension 4
                </span>
                <span className="text-[11px] text-slate-400">Zoning Architecture</span>
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide mt-1">
                Interior Composition Zoning Tier
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose the architectural zoning tier for contrasting bolsters and fluting.
              </p>
            </div>

            <div className="space-y-3">
              {compositionOptions.map((comp) => {
                const isSelected = compositionTier === comp.tier;
                return (
                  <button
                    key={comp.tier}
                    type="button"
                    onClick={() => setCompositionTier(comp.tier)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 ${
                      isSelected
                        ? "bg-[#1A1D24] border-[#38B6FF] shadow-[0_0_15px_rgba(56,182,255,0.2)] ring-1 ring-[#38B6FF]"
                        : "bg-[#18191D] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#1C1D22]"
                    }`}
                  >
                    <div className="shrink-0 mt-1">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-[#38B6FF] bg-[#38B6FF]"
                            : "border-slate-600 bg-transparent"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-black font-bold" />}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          {comp.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {comp.tier === "bespoke_monotone" ? "Tier 1" : comp.tier === "bespoke_duotone" ? "Tier 2" : "Tier 3"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{comp.description}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{comp.detail}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Secondary Color Swatches (if duotone or fluted) */}
            {compositionTier !== "bespoke_monotone" && (
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200">
                    Secondary Accent Bolster Hide
                  </h4>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Proposed (Gate 5)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {secondaryColors.slice(0, 6).map((color) => {
                    const isSelected = secondaryColorId === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSecondaryColor(color.id)}
                        className={`p-2.5 rounded-lg border text-left flex items-center space-x-2.5 transition-all ${
                          isSelected
                            ? "bg-[#1F232D] border-[#38B6FF] ring-1 ring-[#38B6FF]"
                            : "bg-[#17181D] border-white/[0.06] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: color.hexCode }}
                        />
                        <span className="text-[11px] font-medium text-slate-200 truncate">
                          {color.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROPOSED EXTENDED OPTIONS ACCORDION (TRIM VENEER & AMBIENT GLOW) */}
        <div className="pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setShowExtendedProposed(!showExtendedProposed)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] text-left transition-all"
          >
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-slate-300">
                Proposed Extended Options
              </span>
              <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Pending Gate 5
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                showExtendedProposed ? "rotate-180" : ""
              }`}
            />
          </button>

          {showExtendedProposed && (
            <div className="mt-3 p-3.5 rounded-xl bg-black/30 border border-white/[0.06] space-y-4">
              <p className="text-[11px] text-slate-400">
                These options are supported in the 3D scene graph and UI scaffold for architecture demonstration, but are unconfirmed for V1 customer selection.
              </p>

              {/* Trim Deck Veneers */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 mb-2">
                  Trim Deck Veneers (Proposed Gate 2 & 5)
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {trimDeckMaterials.map((trim) => {
                    const isSelected = trimDeckId === trim.id;
                    return (
                      <button
                        key={trim.id}
                        type="button"
                        onClick={() => setTrimDeck(trim.id)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          isSelected
                            ? "bg-[#1A1D24] border-[#38B6FF] text-white"
                            : "bg-[#16171B] border-white/[0.06] text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="font-semibold block truncate">{trim.name.split(" ")[0]}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{trim.category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ambient Illumination */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 mb-2">
                  Ambient Lighting Tone (3D Feature • Proposed V1 Dimension)
                </h5>
                <div className="flex flex-wrap gap-2">
                  {ambientPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setAmbientLight(preset.hex, preset.name)}
                      className={`px-2.5 py-1 rounded-lg border text-xs flex items-center space-x-1.5 ${
                        ambientLightHex === preset.hex
                          ? "bg-[#1C212A] border-[#38B6FF] text-white"
                          : "bg-[#16171B] border-white/[0.06] text-slate-400"
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="text-[11px]">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Step Navigation Footer */}
      <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#16171B] flex items-center justify-between">
        <button
          type="button"
          disabled={activeStep === 1}
          onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          Previous Step
        </button>

        <div className="flex items-center space-x-1.5">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeStep === i
                  ? "w-6 bg-[#38B6FF]"
                  : activeStep > i
                  ? "w-2 bg-[#38B6FF]/60"
                  : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {activeStep < 4 ? (
          <button
            type="button"
            onClick={() => setActiveStep((s) => Math.min(4, s + 1))}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#1F222B] text-white hover:bg-[#252934] border border-white/[0.1] flex items-center space-x-1.5 transition-all"
          >
            <span>Next Step</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#38B6FF]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Restart Sequence</span>
          </button>
        )}
      </div>
    </div>
  );
}
