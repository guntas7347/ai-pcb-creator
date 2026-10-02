"use client";

import React, { useState } from "react";
import { Connection } from "@/lib/circuit-types";
import { ArrowRight, Search, Radio } from "lucide-react";

interface ConnectionsTableProps {
  connections: Connection[];
}

export function ConnectionsTable({ connections }: ConnectionsTableProps) {
  const [search, setSearch] = useState("");

  if (!connections || connections.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl">
        No electrical connections declared.
      </div>
    );
  }

  const filtered = connections.filter((conn) => {
    const term = search.toLowerCase();
    return (
      conn.from.toLowerCase().includes(term) ||
      conn.to.toLowerCase().includes(term)
    );
  });

  const isPowerNode = (pin: string) => {
    const p = pin.toUpperCase();
    return (
      p.includes("VCC") ||
      p.includes("5V") ||
      p.includes("3V3") ||
      p.includes("12V") ||
      p.includes("GND") ||
      p.includes("POS") ||
      p.includes("NEG")
    );
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
      {/* Search Header */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Net Connections ({connections.length})
          </span>
        </div>

        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter pins or nets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">
            No connections match &ldquo;{search}&rdquo;
          </div>
        ) : (
          filtered.map((conn, idx) => {
            const isFromPower = isPowerNode(conn.from);
            const isToPower = isPowerNode(conn.to);

            return (
              <div
                key={idx}
                className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span className="text-[11px] font-mono text-zinc-400 w-6">#{idx + 1}</span>

                <div className="flex-1 flex items-center justify-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md font-mono font-medium border ${
                      isFromPower
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {conn.from}
                  </span>

                  <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-600">
                    <div className="w-6 h-[1px] bg-zinc-300 dark:bg-zinc-700"></div>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
                    <div className="w-6 h-[1px] bg-zinc-300 dark:bg-zinc-700"></div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-md font-mono font-medium border ${
                      isToPower
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {conn.to}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
