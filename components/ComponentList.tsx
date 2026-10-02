"use client";

import React from "react";
import { ComponentItem } from "@/lib/circuit-types";
import { Cpu, Zap, Radio, ToggleLeft, Battery, Activity, Cable, Disc } from "lucide-react";

interface ComponentListProps {
  components: ComponentItem[];
}

export function ComponentList({ components }: ComponentListProps) {
  if (!components || components.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl">
        No components declared in circuit data.
      </div>
    );
  }

  const getComponentIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("resistor")) return <Activity className="w-4 h-4 text-amber-500" />;
    if (t.includes("led")) return <Zap className="w-4 h-4 text-red-500" />;
    if (t.includes("ic") || t.includes("microcontroller") || t.includes("chip"))
      return <Cpu className="w-4 h-4 text-cyan-500" />;
    if (t.includes("cap")) return <Disc className="w-4 h-4 text-blue-500" />;
    if (t.includes("diode")) return <Radio className="w-4 h-4 text-emerald-500" />;
    if (t.includes("battery")) return <Battery className="w-4 h-4 text-orange-500" />;
    if (t.includes("switch")) return <ToggleLeft className="w-4 h-4 text-purple-500" />;
    return <Cable className="w-4 h-4 text-zinc-500" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {components.map((comp) => (
        <div
          key={comp.id}
          className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all shadow-xs group"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/40 transition-colors">
                {getComponentIcon(comp.type)}
              </div>
              <div>
                <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {comp.id}
                </span>
                <span className="ml-2 text-xs capitalize text-zinc-500 dark:text-zinc-400">
                  {comp.type}
                </span>
              </div>
            </div>

            {comp.value && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono text-xs font-semibold border border-cyan-200 dark:border-cyan-800">
                {comp.value}
              </span>
            )}
          </div>

          {comp.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
              {comp.description}
            </p>
          )}

          {/* Pins list */}
          <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mb-1.5">
              Pins ({comp.pins?.length || 0}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {comp.pins?.map((pin) => (
                <span
                  key={pin.id}
                  title={`Pin ID: ${pin.id} (${pin.name})`}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1"
                >
                  <span className="text-zinc-400 dark:text-zinc-500 font-bold">{pin.id}:</span>
                  <span>{pin.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
