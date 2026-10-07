"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sparkles, SlidersHorizontal, ShieldCheck, Compass, MessageSquare } from "lucide-react";
import { useConfigurator } from "@/lib/state/configurator-context";

export function AtelierHeader() {
  const { referenceCode } = useConfigurator();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0B0B0B]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Block */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="group flex items-center space-x-3">
            {/* AutoLab Crest Icon */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#141416] border border-white/[0.1] shadow-inner transition-all duration-300 group-hover:border-[#38B6FF]/50 group-hover:shadow-[0_0_15px_rgba(56,182,255,0.25)]">
              <div className="h-4 w-4 rotate-45 border-2 border-[#38B6FF] transition-transform duration-500 group-hover:rotate-180" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_#38B6FF]" />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="font-extrabold tracking-[0.22em] text-white text-lg sm:text-xl font-mono">
                  AUTO<span className="text-[#38B6FF]">LAB</span>
                </span>
                <span className="text-[10px] text-slate-400 font-sans tracking-normal align-top">
                  ™
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.28em] text-slate-400 font-medium">
                Bespoke Atelier
              </span>
            </div>
          </Link>

          {/* S-Class Atelier Badge */}
          <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-white/[0.08]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#141416] border border-white/[0.08] px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38B6FF] shadow-[0_0_6px_#38B6FF]" />
              <span className="font-medium tracking-wide text-white">S-Class V223 Atelier</span>
            </span>
          </div>
        </div>

        {/* Center: Vehicle Indicator */}
        <div className="hidden md:flex items-center space-x-2 rounded-full bg-[#141416]/90 border border-white/[0.08] px-4 py-1.5">
          <Compass className="h-3.5 w-3.5 text-[#38B6FF]" />
          <span className="text-xs font-medium text-slate-300">Selected Platform:</span>
          <span className="text-xs font-semibold tracking-wide text-white">
            Mercedes-Benz S-Class (V223 LWB)
          </span>
          <span className="text-[10px] font-mono text-slate-500 bg-black/40 px-1.5 py-0.5 rounded">
            MY 2021-2025
          </span>
        </div>

        {/* Right Status & Meta Pill */}
        <div className="flex items-center space-x-3">
          {/* Demonstration Mode Indicator Pill */}
          <div className="flex items-center space-x-2 rounded-full bg-[#141416] border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] tracking-tight">Preview Mode — Local Build</span>
          </div>

          {/* Reference Hash indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500">REF:</span>
            <span className="text-[#38B6FF] font-semibold">{referenceCode}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
