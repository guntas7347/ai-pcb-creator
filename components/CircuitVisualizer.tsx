"use client";

import React, { useMemo } from "react";
import { CircuitData } from "@/lib/circuit-types";

interface CircuitVisualizerProps {
  circuit: CircuitData;
}

export function CircuitVisualizer({ circuit }: CircuitVisualizerProps) {
  const { components = [], connections = [] } = circuit;

  // Calculate layout nodes for each component
  const layout = useMemo(() => {
    const total = components.length;
    if (total === 0) return { nodes: [], connectionsFormatted: [], width: 400, height: 260 };

    // Arrange in a balanced grid
    const cols = Math.ceil(Math.sqrt(total * 1.5));
    const nodeWidth = 140;
    const nodeHeight = 85;
    const paddingX = 70;
    const paddingY = 60;

    const nodes = components.map((comp, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = 50 + col * (nodeWidth + paddingX);
      const y = 40 + row * (nodeHeight + paddingY);

      return {
        id: comp.id,
        type: comp.type,
        value: comp.value,
        pins: comp.pins || [],
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        centerX: x + nodeWidth / 2,
        centerY: y + nodeHeight / 2,
      };
    });

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Map connection wires
    const connectionsFormatted = connections
      .map((conn, idx) => {
        const [fromComp] = conn.from.split(".");
        const [toComp] = conn.to.split(".");

        const fromNode = nodeMap.get(fromComp);
        const toNode = nodeMap.get(toComp);

        if (!fromNode || !toNode) return null;

        const isSelf = fromNode.id === toNode.id;
        const x1 = fromNode.centerX;
        const y1 = fromNode.centerY;
        const x2 = toNode.centerX;
        const y2 = toNode.centerY;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 + (idx % 2 === 0 ? 25 : -25);
        const durationSec = 2 + ((idx % 4) * 0.5);

        return {
          id: `conn-${idx}`,
          from: conn.from,
          to: conn.to,
          duration: `${durationSec}s`,
          d: isSelf
            ? `M ${x1} ${y1 - 20} C ${x1 + 40} ${y1 - 60}, ${x1 + 60} ${y1}, ${x1 + 20} ${y1}`
            : `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`,
          color: idx % 2 === 0 ? "#06b6d4" : "#818cf8",
        };
      })
      .filter(Boolean);

    // Calculate canvas size
    const maxX = Math.max(...nodes.map((n) => n.x + n.width), 400) + 60;
    const maxY = Math.max(...nodes.map((n) => n.y + n.height), 260) + 60;

    return { nodes, connectionsFormatted, width: maxX, height: maxY };
  }, [components, connections]);

  if (components.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
        No circuit components to render.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-4 overflow-hidden relative shadow-inner">
      {/* Grid PCB Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0),
            linear-gradient(to right, #27272a 1px, transparent 1px),
            linear-gradient(to bottom, #27272a 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        }}
      />

      <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 relative z-10">
        <span className="font-mono text-cyan-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          SCHEMATIC NET TOPOLOGY ({components.length} Nodes / {connections.length} Traces)
        </span>
        <span className="text-[11px] text-zinc-500 font-mono">Auto-Routed Logical Graph</span>
      </div>

      <div className="overflow-x-auto overflow-y-hidden max-h-[380px] relative z-10 py-2">
        <svg
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="min-w-full"
        >
          {/* Connection Lines / Traces */}
          {layout.connectionsFormatted.map((conn) => conn && (
            <g key={conn.id} className="group">
              {/* Outer glow trace */}
              <path
                d={conn.d}
                fill="none"
                stroke={conn.color}
                strokeWidth="4"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
              {/* Core signal trace */}
              <path
                d={conn.d}
                fill="none"
                stroke={conn.color}
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-[dash_15s_linear_infinite]"
              />
              {/* Signal pulse particle */}
              <circle r="3" fill="#ffffff">
                <animateMotion
                  path={conn.d}
                  dur={conn.duration}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* Component Nodes */}
          {layout.nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Component Box */}
              <rect
                width={node.width}
                height={node.height}
                rx="8"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1.5"
                className="hover:stroke-cyan-400 transition-colors"
              />

              {/* Top title bar */}
              <rect width={node.width} height="24" rx="8" fill="#27272a" />
              <text
                x="8"
                y="16"
                fill="#38bdf8"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {node.id}
              </text>
              <text
                x={node.width - 8}
                y="16"
                fill="#a1a1aa"
                fontSize="9"
                textAnchor="end"
                fontFamily="sans-serif"
              >
                {node.type}
              </text>

              {/* Value */}
              {node.value && (
                <text
                  x={node.width / 2}
                  y="45"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.value}
                </text>
              )}

              {/* Pin dots */}
              <g transform="translate(6, 62)">
                {node.pins.slice(0, 4).map((pin, pIdx) => (
                  <g key={pin.id} transform={`translate(${pIdx * 30}, 0)`}>
                    <circle cx="6" cy="6" r="3" fill="#06b6d4" />
                    <text x="12" y="9" fill="#71717a" fontSize="8" fontFamily="monospace">
                      {pin.id}
                    </text>
                  </g>
                ))}
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
