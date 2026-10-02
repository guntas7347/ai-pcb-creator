"use client";

import React, { useState, useEffect } from "react";
import { PRESET_CIRCUITS } from "@/lib/constants";
import { PresetCircuit } from "@/lib/circuit-types";
import { ComponentList } from "@/components/ComponentList";
import { ConnectionsTable } from "@/components/ConnectionsTable";
import { CircuitVisualizer } from "@/components/CircuitVisualizer";
import {
  Cpu,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Terminal,
  Lock,
  Zap,
  Info,
  SlidersHorizontal,
} from "lucide-react";

export default function CircuitStudioPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_CIRCUITS[0].id);
  const [activeTab, setActiveTab] = useState<"schematic" | "components" | "connections">("schematic");
  const [isGenerating, setIsGenerating] = useState(false);

  const activePreset = PRESET_CIRCUITS.find((p) => p.id === selectedPresetId) || PRESET_CIRCUITS[0];
  const activeCircuit = activePreset.json;

  // Auto-generate circuit and console.log the JSON on selection or mount
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString();

    // Print JSON output directly to console as requested
    console.group(`%c⚡ [AI PCB Engine] Auto-Generated Circuit: ${activePreset.title}`, "color: #06b6d4; font-weight: bold; font-size: 13px;");
    console.log("%cTimestamp:", "color: #a1a1aa;", timeStr);
    console.log("%cPrompt:", "color: #818cf8; font-style: italic;", activePreset.prompt);
    console.log("%cStructured Circuit JSON Object:", "color: #10b981; font-weight: bold;", activeCircuit);
    console.log("%cRaw JSON String:\n", "color: #f59e0b;", JSON.stringify(activeCircuit, null, 2));
    console.groupEnd();
  }, [activePreset, activeCircuit]);

  const handleSelectTemplate = (preset: PresetCircuit) => {
    if (preset.id === selectedPresetId) return;
    setIsGenerating(true);
    setSelectedPresetId(preset.id);
    setTimeout(() => {
      setIsGenerating(false);
    }, 250);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              AI Circuit Design Studio
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Select a prebuilt circuit prompt template to auto-generate and simulate the hardware schematic.
          </p>
        </div>

        {/* Live Console Output Notification */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 text-xs text-cyan-800 dark:text-cyan-300 shadow-xs">
          <Terminal className="w-4 h-4 text-cyan-500 shrink-0" />
          <div>
            <span className="font-semibold">JSON Logged to DevTools Console</span>
            <span className="text-[11px] opacity-75 block">Press F12 or Inspect &gt; Console</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Prompts/Templates on Left, Visual Circuit Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Faded Prompt & Prebuilt Template Selector */}
        <div className="lg:col-span-5 space-y-6">
          {/* Faded / Disabled Prompt Box */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Prompt (Template Locked)</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                Read-Only
              </span>
            </div>

            {/* Faded Textarea */}
            <div className="relative">
              <textarea
                rows={4}
                readOnly
                disabled
                value={activePreset.prompt}
                className="w-full p-3.5 rounded-xl border border-zinc-300/80 dark:border-zinc-700/80 bg-zinc-100/70 dark:bg-zinc-950/70 text-sm text-zinc-500 dark:text-zinc-400 font-sans cursor-not-allowed select-none opacity-60 resize-none shadow-inner"
              />
              <div className="absolute inset-0 bg-transparent cursor-not-allowed" />
            </div>

            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
              <span>Prompt editing is locked. Choose a prebuilt circuit template below:</span>
            </p>
          </div>

          {/* Prebuilt Prompt Template Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
                Select Circuit Template:
              </span>
              <span className="text-[11px] text-zinc-400">
                {PRESET_CIRCUITS.length} available
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {PRESET_CIRCUITS.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectTemplate(preset)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1.5 relative group ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 shadow-sm ring-1 ring-cyan-500/50"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-cyan-400 transition-colors"></span>
                        )}
                        {preset.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {preset.category}
                      </span>
                    </div>

                    <p className="text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed text-[11.5px]">
                      &ldquo;{preset.prompt}&rdquo;
                    </p>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                      <span>{preset.json.components.length} components</span>
                      <span>•</span>
                      <span>{preset.json.connections.length} nets</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Circuit Output (Schematic, Components, Nets) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Metadata Card */}
          {activeCircuit?.metadata && (
            <div className="p-4 rounded-xl border border-cyan-200/80 dark:border-cyan-900/60 bg-cyan-50/50 dark:bg-cyan-950/20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                  {activeCircuit.metadata.name || activePreset.title}
                </span>
                {activeCircuit.metadata.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {activeCircuit.metadata.description}
                  </p>
                )}
              </div>

              {activeCircuit.metadata.powerRequirements && (
                <div className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-cyan-200 dark:border-cyan-800 text-[11px] font-mono text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{activeCircuit.metadata.powerRequirements}</span>
                </div>
              )}
            </div>
          )}

          {/* Console Log status notification bar */}
          <div className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Circuit JSON rendered & dispatched to <code className="font-mono text-cyan-600 dark:text-cyan-400">console.log</code>
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              Schema v{activeCircuit.version}
            </span>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs">
              <button
                onClick={() => setActiveTab("schematic")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "schematic"
                    ? "bg-white dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 shadow-xs font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Schematic Net Graph</span>
              </button>

              <button
                onClick={() => setActiveTab("components")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "components"
                    ? "bg-white dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 shadow-xs font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Components ({activeCircuit?.components?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("connections")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "connections"
                    ? "bg-white dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 shadow-xs font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Nets ({activeCircuit?.connections?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* Active Visual Output */}
          <div className={isGenerating ? "opacity-50 transition-opacity" : "transition-opacity"}>
            {activeTab === "schematic" && activeCircuit && (
              <CircuitVisualizer circuit={activeCircuit} />
            )}

            {activeTab === "components" && activeCircuit && (
              <ComponentList components={activeCircuit.components || []} />
            )}

            {activeTab === "connections" && activeCircuit && (
              <ConnectionsTable connections={activeCircuit.connections || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
