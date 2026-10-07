"use client";

import React from "react";
import { ConfiguratorProvider } from "@/lib/state/configurator-context";
import { AtelierHeader } from "@/components/layout/AtelierHeader";
import { VisualizationStage } from "@/components/configurator/VisualizationStage";
import { ConfigurationDrawer } from "@/components/configurator/ConfigurationDrawer";
import { SummaryBar } from "@/components/configurator/SummaryBar";
import { ShieldCheck, Compass, Sparkles, SlidersHorizontal, Award } from "lucide-react";

export default function AtelierShowroomPage() {
  return (
    <ConfiguratorProvider>
      <div className="flex min-h-screen flex-col bg-[#0B0B0B] text-white selection:bg-[#38B6FF] selection:text-black">
        {/* Atelier Luxury Header */}
        <AtelierHeader />

        {/* Main Atelier Configurator Grid */}
        <main className="flex-1 pb-28 pt-4 sm:pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Atelier Sub-banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#38B6FF]">
                    Tailoring Atelier Program
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">Mercedes-Benz S-Class Series 223</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                  Bespoke Interior Configurator
                </h1>
              </div>

              {/* Provenance Indicators */}
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#141416] border border-white/[0.06]">
                  <Award className="h-3.5 w-3.5 text-[#38B6FF]" />
                  <span>Handcrafted Hides</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#141416] border border-white/[0.06]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Nairobi Atelier</span>
                </div>
              </div>
            </div>

            {/* Configurator 2-Column Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Stage (7 cols on lg) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <VisualizationStage />

                {/* Technical Footnote / Production Context */}
                <div className="rounded-xl bg-[#141416]/60 border border-white/[0.06] p-4 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-[#38B6FF]/10 text-[#38B6FF] shrink-0 mt-0.5">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-slate-200">
                      Confirmed V1 Configuration Dimensions
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      This showcase preview reflects the frozen V1 sequence:{" "}
                      <span className="text-white font-medium">
                        Material → Colour → Accent Thread → Interior Composition
                      </span>
                      . Mesh nodes and 3D Draco GLB bindings are decoupled for Astra downstream integration.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: 4-Step Configuration Drawer (5 cols on lg) */}
              <div className="lg:col-span-5 flex flex-col">
                <ConfigurationDrawer />
              </div>
            </div>
          </div>
        </main>

        {/* Sticky Summary Bar & WhatsApp Booking CTA */}
        <SummaryBar />
      </div>
    </ConfiguratorProvider>
  );
}
