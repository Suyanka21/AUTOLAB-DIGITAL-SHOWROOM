"use client";

import React, { useState } from "react";
import { Camera, Eye, Sparkles, Layers, Sliders, Maximize2, Info, Compass } from "lucide-react";
import { useConfigurator, CameraViewId } from "@/lib/state/configurator-context";

interface CameraPresetTab {
  id: CameraViewId;
  label: string;
  sublabel: string;
  focalTarget: string;
}

const CAMERA_TABS: CameraPresetTab[] = [
  {
    id: "cockpit_master",
    label: "Cockpit Master",
    sublabel: "Full Horizon & 12.8\" OLED",
    focalTarget: "Panoramic dashboard sweep, waterfall console, front multicontour seats",
  },
  {
    id: "driver_cluster",
    label: "Driver Cluster",
    sublabel: "12.3\" Cluster & AMG Wheel",
    focalTarget: "Double-spoke AMG-Line steering wheel, digital instruments, driver tactile zone",
  },
  {
    id: "executive_rear",
    label: "Executive Rear",
    sublabel: "43.5° First-Class Suite",
    focalTarget: "Rear executive suite, folding calf rest, central bespoke business tunnel",
  },
  {
    id: "door_burmester",
    label: "Door & Burmester",
    sublabel: "Acoustic 4D & Veneer Deck",
    focalTarget: "High-end Burmester 4D speaker perforation, upper wood wing, seat controls",
  },
];

export function VisualizationStage() {
  const {
    activeCameraView,
    setActiveCameraView,
    selectedPrimaryColor,
    selectedPrimaryMaterial,
    selectedSecondaryColor,
    selectedTrimDeck,
    selectedAccentThread,
    compositionTier,
    ambientLightHex,
    ambientLightName,
    referenceCode,
  } = useConfigurator();

  const [isFullscreenNote, setIsFullscreenNote] = useState(false);

  // Derive visual colors
  const primaryHex = selectedPrimaryColor?.hexCode || "#75452B";
  const secondaryHex =
    compositionTier === "bespoke_monotone"
      ? primaryHex
      : selectedSecondaryColor?.hexCode || "#151618";
  const threadHex = selectedAccentThread?.hexCode || "#D4AF37";
  const trimHex =
    selectedTrimDeck?.id === "open-pore-poplar"
      ? "#2A2B2E"
      : selectedTrimDeck?.id === "open-pore-walnut"
      ? "#543825"
      : selectedTrimDeck?.id === "piano-lacquer-flowing-lines"
      ? "#101012"
      : "#1D1E22";

  const activeTabMeta =
    CAMERA_TABS.find((t) => t.id === activeCameraView) || CAMERA_TABS[0];

  return (
    <div className="relative flex flex-col w-full h-full min-h-[500px] lg:min-h-[640px] rounded-2xl bg-[#0F1014] border border-white/[0.08] overflow-hidden shadow-2xl">
      {/* Studio Ambient Backlight Glow (Dynamic with Ambient Light Color) */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[650px] rounded-full blur-[140px] opacity-35 transition-all duration-700 ease-out"
        style={{ backgroundColor: ambientLightHex }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[300px] w-[450px] rounded-full blur-[120px] opacity-20 transition-all duration-700 ease-out"
        style={{ backgroundColor: primaryHex }}
      />

      {/* Top Bar: Camera Presets Selector */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 border-b border-white/[0.06] bg-[#141416]/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Camera className="h-4 w-4 text-[#38B6FF]" />
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-300">
            Studio Perspectives
          </span>
        </div>

        {/* Camera Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
          {CAMERA_TABS.map((tab) => {
            const isActive = tab.id === activeCameraView;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCameraView(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                  isActive
                    ? "bg-[#1C1E24] text-white shadow-sm border border-[#38B6FF]/40 shadow-[0_0_12px_rgba(56,182,255,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <span
                    className="h-1.5 w-1.5 rounded-full shadow-sm animate-pulse"
                    style={{ backgroundColor: "#38B6FF" }}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Scale Indicator */}
        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-[#38B6FF]" />
          <span>V223 LWB (3,216 mm)</span>
        </div>
      </div>

      {/* Main Viewport Showcase Canvas (Authentic S-Class 2D Studio Representation) */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
        {/* Subtle Luxury Grid Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Architectural Studio Illustration of S-Class Cabin (Reactively reflects colors) */}
        <div className="relative w-full max-w-2xl aspect-[16/10] flex items-center justify-center transition-all duration-500">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full drop-shadow-2xl transition-all duration-700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Dynamic Gradients */}
              <linearGradient id="leatherPrimaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={primaryHex} stopOpacity="0.95" />
                <stop offset="100%" stopColor={primaryHex} stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id="leatherSecondaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={secondaryHex} stopOpacity="0.98" />
                <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="trimDeckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={trimHex} />
                <stop offset="50%" stopColor="#3C3D42" stopOpacity="0.5" />
                <stop offset="100%" stopColor={trimHex} />
              </linearGradient>

              <radialGradient id="oledGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38B6FF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0F1015" stopOpacity="0.9" />
              </radialGradient>

              {/* Diamond Quilting Pattern with Accent Thread */}
              <pattern
                id="quiltPattern"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <path
                  d="M 0 0 L 20 0 L 20 20 L 0 20 Z"
                  fill="none"
                  stroke={threadHex}
                  strokeWidth="0.8"
                  strokeOpacity="0.55"
                />
              </pattern>
            </defs>

            {/* Background Cabin Depth Architecture */}
            <rect x="40" y="30" width="720" height="440" rx="28" fill="#111216" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            
            {/* Rear Cabin Depth & Headlining */}
            <path d="M 120 70 L 680 70 L 630 180 L 170 180 Z" fill="#0C0D10" stroke="rgba(255,255,255,0.04)" />
            
            {/* 253-LED Ambient Fiber Sweep (Reacts to Ambient Lighting Hex) */}
            <path
              d="M 100 190 Q 400 160 700 190"
              stroke={ambientLightHex}
              strokeWidth="4"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px currentColor)"
              className="transition-colors duration-500"
            />
            <path
              d="M 140 230 Q 400 205 660 230"
              stroke={ambientLightHex}
              strokeWidth="2"
              strokeOpacity="0.6"
              strokeLinecap="round"
              className="transition-colors duration-500"
            />

            {/* Upper Dashboard Trim Deck (Open-pore Wood / Carbon) */}
            <path
              d="M 140 220 L 660 220 L 620 260 L 180 260 Z"
              fill="url(#trimDeckGrad)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            {/* Fine Horizontal Pinstripes for Veneer Texture */}
            <line x1="160" y1="230" x2="640" y2="230" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="6 3" />
            <line x1="170" y1="245" x2="630" y2="245" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="10 4" />

            {/* Front Left Seat (Driver) */}
            {/* Outer Bolsters (Secondary Leather) */}
            <path
              d="M 160 270 Q 140 330 150 430 L 260 430 Q 270 330 250 270 Z"
              fill="url(#leatherSecondaryGrad)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.2"
            />
            {/* Center Flutes (Primary Leather with Quilting & Stitching) */}
            <path
              d="M 180 280 Q 170 340 180 430 L 230 430 Q 240 340 230 280 Z"
              fill="url(#leatherPrimaryGrad)"
              stroke={threadHex}
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Center Quilted Mesh Overlay */}
            <path
              d="M 182 285 Q 172 342 182 425 L 228 425 Q 238 342 228 285 Z"
              fill="url(#quiltPattern)"
              opacity="0.4"
            />

            {/* Front Right Seat (Passenger) */}
            {/* Outer Bolsters (Secondary Leather) */}
            <path
              d="M 540 270 Q 520 330 530 430 L 640 430 Q 650 330 630 270 Z"
              fill="url(#leatherSecondaryGrad)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.2"
            />
            {/* Center Flutes (Primary Leather with Stitching) */}
            <path
              d="M 560 280 Q 550 340 560 430 L 610 430 Q 620 340 610 280 Z"
              fill="url(#leatherPrimaryGrad)"
              stroke={threadHex}
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <path
              d="M 562 285 Q 552 342 562 425 L 608 425 Q 618 342 608 285 Z"
              fill="url(#quiltPattern)"
              opacity="0.4"
            />

            {/* Center Console Waterfall Tunnel */}
            <path
              d="M 330 250 L 470 250 L 490 440 L 310 440 Z"
              fill="#16171B"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />
            {/* Center Armrest Split (Secondary or Primary depending on tier) */}
            <rect
              x="340"
              y="370"
              width="120"
              height="70"
              rx="12"
              fill={compositionTier === "executive_fluted" ? primaryHex : secondaryHex}
              stroke={threadHex}
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
            <line x1="400" y1="370" x2="400" y2="440" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* 12.8" MBUX Central OLED Display (60° Inclination) */}
            <rect
              x="345"
              y="255"
              width="110"
              height="100"
              rx="10"
              fill="url(#oledGlow)"
              stroke="#38B6FF"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
            <text x="400" y="295" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
              MBUX ATELIER
            </text>
            <text x="400" y="315" textAnchor="middle" fill="#94A3B8" fontSize="7.5" fontFamily="sans-serif">
              {activeTabMeta.label}
            </text>
            <circle cx="400" cy="335" r="3" fill="#38B6FF" />

            {/* Driver Steering Wheel Boss Silhouette (Left Cockpit) */}
            <circle cx="210" cy="240" r="46" fill="none" stroke="#23252C" strokeWidth="9" />
            <circle cx="210" cy="240" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="210" cy="240" r="16" fill="#17181D" stroke={threadHex} strokeWidth="1" />
            <line x1="165" y1="240" x2="255" y2="240" stroke="#2A2C34" strokeWidth="5" />

            {/* Burmester 4D Speaker Grille Silhouette (Left & Right) */}
            <circle cx="90" cy="310" r="18" fill="#1C1E23" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />
            <circle cx="710" cy="310" r="18" fill="#1C1E23" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />

            {/* View Annotation Pin */}
            <g transform="translate(400, 100)">
              <rect x="-100" y="-14" width="200" height="28" rx="14" fill="#141416" stroke="rgba(255,255,255,0.12)" />
              <circle cx="-80" cy="0" r="3.5" fill="#38B6FF" />
              <text x="-65" y="4" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                {activeTabMeta.label} Focal View
              </text>
            </g>
          </svg>
        </div>

        {/* Floating Active-Specification Badge (Live Configuration Summary) */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 max-w-[280px] sm:max-w-xs rounded-xl bg-[#141416]/90 border border-white/[0.1] p-3.5 backdrop-blur-xl shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2.5">
            <div className="flex items-center space-x-2">
              <span
                className="h-2.5 w-2.5 rounded-full shadow-sm animate-pulse"
                style={{ backgroundColor: ambientLightHex }}
              />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                Live Spec (UI Scaffold)
              </span>
            </div>
            <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              Proposed
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Primary Leather */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Primary Hide:</span>
              <div className="flex items-center space-x-1.5 font-medium text-white">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: primaryHex }}
                />
                <span className="truncate max-w-[140px] text-[11px]">
                  {selectedPrimaryColor?.name || "Exclusive Nappa"}
                </span>
              </div>
            </div>

            {/* Composition */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Composition:</span>
              <span className="text-[11px] font-medium text-slate-200">
                {compositionTier === "bespoke_monotone"
                  ? "Monotone"
                  : compositionTier === "bespoke_duotone"
                  ? "Duotone Bolsters"
                  : "Executive Fluted"}
              </span>
            </div>

            {/* Trim Deck */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Trim Deck:</span>
              <div className="flex items-center space-x-1.5 font-medium text-white">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: trimHex }}
                />
                <span className="truncate max-w-[140px] text-[11px]">
                  {selectedTrimDeck?.name || "Open-Pore"}
                </span>
              </div>
            </div>

            {/* Accent Thread */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Thread:</span>
              <div className="flex items-center space-x-1.5 font-medium text-white">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: threadHex }}
                />
                <span className="truncate max-w-[140px] text-[11px]">
                  {selectedAccentThread?.name.split(" ")[0]} ({selectedAccentThread?.stitchPattern})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Info Pill (Astra 3D WebGL Bridge Status) */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 flex items-center space-x-2 rounded-full bg-[#141416]/90 border border-white/[0.08] px-3.5 py-1.5 text-xs text-slate-400 backdrop-blur-md">
          <Layers className="h-3.5 w-3.5 text-[#38B6FF]" />
          <span className="hidden sm:inline">WebGL Standby:</span>
          <span className="text-slate-200 font-mono text-[11px]">
            Astra 3D Pipeline Handoff Spec Locked
          </span>
        </div>

        {/* Ambient Light Indicator (Bottom Right) */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center space-x-2 rounded-full bg-[#141416]/90 border border-white/[0.08] px-3 py-1.5 text-xs backdrop-blur-md">
          <span
            className="h-2.5 w-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: ambientLightHex, boxShadow: `0 0 10px ${ambientLightHex}` }}
          />
          <span className="text-slate-300 font-medium text-[11px]">
            Ambient Glow: <span className="text-white">{ambientLightName}</span>
          </span>
        </div>
      </div>

      {/* Viewport Footer Focal Target Description */}
      <div className="relative z-10 px-4 py-2.5 sm:px-6 border-t border-white/[0.06] bg-[#141416]/90 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Info className="h-3.5 w-3.5 text-[#38B6FF]" />
          <span className="font-medium text-slate-300">Focal Perspective:</span>
          <span className="text-slate-400 italic truncate max-w-md">
            {activeTabMeta.focalTarget}
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
          <span>Draco GLB Slot Bridge</span>
          <span>•</span>
          <span className="text-[#38B6FF]">V1 Baseline</span>
        </div>
      </div>
    </div>
  );
}
