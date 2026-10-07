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
} from "lucide-react";
import { useConfigurator, CompositionTier } from "@/lib/state/configurator-context";
import colorsCatalogue from "@/config/materials/colors.json";
import materialsCatalogue from "@/config/materials/catalogue.json";
import threadsCatalogue from "@/config/materials/accent-threads.json";

export function ConfigurationDrawer() {
  const {
    primaryColorId,
    setPrimaryColor,
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
    selectedTrimDeck,
    selectedAccentThread,
  } = useConfigurator();

  const [activeStep, setActiveStep] = useState<number>(1);

  // Filter seed data for the 4 steps
  // Step 1: Primary Leathers (Nappa Black, Sienna Brown, Macchiato Beige, Carmine Red, Cognac Tan, Oxblood, Emerald)
  const primaryLeatherColors = colorsCatalogue.filter((c) =>
    c.compatibleMaterialIds.includes("nappa-exclusive") ||
    c.compatibleMaterialIds.includes("autolab-heritage-hide")
  );

  // Step 2: Interior Compositions
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

  // Step 3: Trim Deck Woods & Carbons
  const trimDeckMaterials = materialsCatalogue.filter(
    (m) => m.category === "wood" || m.category === "carbon"
  );

  // Step 4: Accent Stitching & Thread
  const accentThreads = threadsCatalogue;

  // Ambient Lighting presets
  const ambientPresets = [
    { hex: "#38B6FF", name: "AutoLab Electric Cyan", label: "Cyan Signature" },
    { hex: "#FF5722", name: "Sunset Amber Ambient", label: "Sunset Amber" },
    { hex: "#E91E63", name: "Miami Rose Ambient", label: "Miami Rose" },
    { hex: "#00BCD4", name: "Ocean Blue Ambient", label: "Ocean Blue" },
    { hex: "#D4AF37", name: "Champagne Luminescence", label: "Champagne Glow" },
  ];

  return (
    <div className="flex flex-col w-full rounded-2xl bg-[#141416] border border-white/[0.08] shadow-2xl overflow-hidden">
      {/* Drawer Header */}
      <div className="p-4 sm:p-6 border-b border-white/[0.08] bg-[#16171B]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-[#38B6FF]" />
            <h2 className="text-base font-semibold tracking-wide text-white">
              Bespoke Configurator
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06]">
            Step {activeStep} of 4
          </span>
        </div>

        {/* 4-Step Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
          {[
            { step: 1, title: "1. Leather", icon: Palette },
            { step: 2, title: "2. Accent", icon: Layers },
            { step: 3, title: "3. Trim", icon: Sparkles },
            { step: 4, title: "4. Stitch", icon: Scissors },
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
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[520px] space-y-6">
        {/* STEP 1: PRIMARY LEATHER */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Select Primary Upholstery Hide
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Semi-aniline luxury hides tailored for central seat flutes and primary touchpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {primaryLeatherColors.map((color) => {
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
                    {/* Swatch Disc with Sheen */}
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

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-white truncate">
                          {color.name}
                        </span>
                        {color.isAutoLabBespoke ? (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#38B6FF]/10 text-[#38B6FF] border border-[#38B6FF]/20">
                            Bespoke
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">
                            {color.factoryCode || "OEM"}
                          </span>
                        )}
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

        {/* STEP 2: SECONDARY ACCENT & COMPOSITION */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Interior Composition Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose the architectural zoning tier for contrasting bolsters and fluting.
              </p>
            </div>

            {/* Composition Tier Cards */}
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
                  <span className="text-[11px] font-mono text-[#38B6FF]">
                    Outer Seat Shell & Wings
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {primaryLeatherColors.slice(0, 6).map((color) => {
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

        {/* STEP 3: TRIM DECK VENEERS */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Dashboard & Waterfall Trim Deck
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Open-pore architectural wood grains and forged composites for dashboard sweeping deck.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trimDeckMaterials.map((trim) => {
                const isSelected = trimDeckId === trim.id;
                const swatchBg =
                  trim.id === "open-pore-poplar"
                    ? "#2E2F32"
                    : trim.id === "open-pore-walnut"
                    ? "#543825"
                    : trim.id === "piano-lacquer-flowing-lines"
                    ? "#0C0C0E"
                    : "#1C1D20";

                return (
                  <button
                    key={trim.id}
                    type="button"
                    onClick={() => setTrimDeck(trim.id)}
                    className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 ${
                      isSelected
                        ? "bg-[#1A1D24] border-[#38B6FF] shadow-[0_0_15px_rgba(56,182,255,0.2)] ring-1 ring-[#38B6FF]"
                        : "bg-[#18191D] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#1C1D22]"
                    }`}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className="h-9 w-9 rounded-lg border border-white/20 shadow-md transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: swatchBg }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-[1px]">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-white truncate">
                          {trim.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {trim.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {trim.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: ACCENT STITCHING & THREAD */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Accent Stitching & Tailoring
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                High-tensile perimeter seams, diamond quilting, and French stitching patterns.
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

            {/* Ambient Lighting Atelier Preset Selector */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    253-LED Ambient Illumination Tone
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Optical fiber perimeter sweep simulation
                  </p>
                </div>
                <span
                  className="h-3 w-3 rounded-full shadow-sm"
                  style={{ backgroundColor: ambientLightHex, boxShadow: `0 0 10px ${ambientLightHex}` }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {ambientPresets.map((preset) => {
                  const isPresetActive = ambientLightHex === preset.hex;
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setAmbientLight(preset.hex, preset.name)}
                      className={`px-3 py-1.5 rounded-lg border text-xs flex items-center space-x-2 transition-all ${
                        isPresetActive
                          ? "bg-[#1C212A] border-[#38B6FF] text-white ring-1 ring-[#38B6FF]"
                          : "bg-[#16171B] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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
                  ? "w-2 bg-emerald-500/80"
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
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#38B6FF]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Review Step 1</span>
          </button>
        )}
      </div>
    </div>
  );
}
