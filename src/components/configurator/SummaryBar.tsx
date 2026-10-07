"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Copy,
  Check,
  FileText,
  Shield,
  ExternalLink,
  ChevronUp,
  X,
  Sparkles,
} from "lucide-react";
import { useConfigurator } from "@/lib/state/configurator-context";

export function SummaryBar() {
  const {
    referenceCode,
    selectedPrimaryColor,
    selectedSecondaryColor,
    selectedTrimDeck,
    selectedAccentThread,
    compositionTier,
    ambientLightName,
    whatsAppHref,
  } = useConfigurator();

  const [copied, setCopied] = useState(false);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const compositionLabel =
    compositionTier === "bespoke_monotone"
      ? "Monotone Hide"
      : compositionTier === "bespoke_duotone"
      ? "Duotone Bolsters"
      : "Executive Fluted";

  return (
    <>
      {/* Sticky Bottom Bar */}
      <aside aria-label="Configuration summary and consultation booking" className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.1] bg-[#0E0F12]/95 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left: Reference Code & Current Selection Preview */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
              {/* Reference Code Badge with Copy Action */}
              <button
                type="button"
                onClick={handleCopyCode}
                title="Click to copy AutoLab Reference Code"
                className="group relative flex items-center space-x-2 rounded-xl bg-[#16171B] border border-white/[0.08] hover:border-[#38B6FF]/50 px-3 py-2 transition-all shadow-inner"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    Atelier Code
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white group-hover:text-[#38B6FF] transition-colors">
                    {referenceCode}
                  </span>
                </div>
                <div className="p-1 rounded-md bg-white/[0.04] text-slate-400 group-hover:text-white">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </div>
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-emerald-500 text-black font-semibold text-[10px] px-2 py-0.5 shadow-md">
                    Copied!
                  </span>
                )}
              </button>

              {/* Specification Pills (Hidden on very small screens) */}
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                {/* Hide Swatch */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#141416] border border-white/[0.06]">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: selectedPrimaryColor?.hexCode }}
                  />
                  <span className="text-slate-200 truncate max-w-[110px] font-medium">
                    {selectedPrimaryColor?.name.split("(")[0]}
                  </span>
                </div>

                {/* Composition */}
                <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#141416] border border-white/[0.06] text-slate-300">
                  <span className="text-slate-500">•</span>
                  <span>{compositionLabel}</span>
                </div>

                {/* Trim Deck */}
                <div className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#141416] border border-white/[0.06] text-slate-300">
                  <span className="text-slate-500">•</span>
                  <span className="truncate max-w-[120px]">{selectedTrimDeck?.name.split(" ")[0]}</span>
                </div>

                {/* Thread */}
                <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#141416] border border-white/[0.06] text-slate-300">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: selectedAccentThread?.hexCode }}
                  />
                  <span className="truncate max-w-[100px]">{selectedAccentThread?.name.split(" ")[0]} Stitch</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              {/* Specification Sheet Button */}
              <button
                type="button"
                onClick={() => setIsSpecModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#141416] hover:bg-[#1A1B20] border border-white/[0.08] transition-all"
              >
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span>Spec Sheet</span>
              </button>

              {/* Primary CTA: WhatsApp Atelier Lead */}
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-1 sm:flex-none flex items-center justify-center space-x-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#38B6FF] to-[#0090E7] text-black font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(56,182,255,0.35)] hover:shadow-[0_0_28px_rgba(56,182,255,0.55)] transition-all duration-300 active:scale-[0.98]"
              >
                <MessageSquare className="h-4 w-4 fill-black" />
                <span className="truncate">
                  Book Bespoke Consultation at AutoLab Atelier
                </span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Specification Sheet Modal */}
      {isSpecModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#141416] border border-white/[0.1] shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#38B6FF]">
                  AutoLab Concierge Docket
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Bespoke Atelier Specification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSpecModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Spec Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Chassis Platform:</span>
                <span className="font-semibold text-white">Mercedes-Benz S-Class (V223 LWB)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Atelier Reference:</span>
                <span className="font-mono font-bold text-[#38B6FF]">{referenceCode}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Primary Leather:</span>
                <div className="flex items-center space-x-1.5 font-medium text-white">
                  <span
                    className="h-3 w-3 rounded-full border border-white/20"
                    style={{ backgroundColor: selectedPrimaryColor?.hexCode }}
                  />
                  <span>{selectedPrimaryColor?.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Zoning Composition:</span>
                <span className="font-medium text-white">{compositionLabel}</span>
              </div>
              {compositionTier !== "bespoke_monotone" && (
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-slate-400">Secondary Accent:</span>
                  <div className="flex items-center space-x-1.5 font-medium text-white">
                    <span
                      className="h-3 w-3 rounded-full border border-white/20"
                      style={{ backgroundColor: selectedSecondaryColor?.hexCode }}
                    />
                    <span>{selectedSecondaryColor?.name}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Trim Deck Veneer:</span>
                <span className="font-medium text-white">{selectedTrimDeck?.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Accent Stitching:</span>
                <span className="font-medium text-white">
                  {selectedAccentThread?.name} ({selectedAccentThread?.stitchPattern})
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Ambient Illumination:</span>
                <span className="font-medium text-white">{ambientLightName}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSpecModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#38B6FF] text-black font-bold text-xs"
              >
                <MessageSquare className="h-3.5 w-3.5 fill-black" />
                <span>Confirm on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
