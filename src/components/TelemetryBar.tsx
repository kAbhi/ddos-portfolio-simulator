"use client";

import React from "react";
import { HeartPulse, Smile, Users, Timer } from "lucide-react";
import { TelemetryMetrics } from "@/types/simulation";

interface TelemetryBarProps {
  metrics: TelemetryMetrics;
}

export function TelemetryBar({ metrics }: TelemetryBarProps) {
  const healthColor =
    metrics.originHealth < 30
      ? "text-rose-400"
      : metrics.originHealth < 70
        ? "text-amber-400"
        : "text-emerald-400";

  const healthBarBg =
    metrics.originHealth < 30
      ? "bg-rose-500"
      : metrics.originHealth < 70
        ? "bg-amber-400"
        : "bg-emerald-400";

  const healthLabel =
    metrics.originHealth < 30
      ? "Crashing!"
      : metrics.originHealth < 70
        ? "Under Stress"
        : "Healthy";

  const successColor =
    metrics.legitSuccessRate < 70
      ? "text-rose-400"
      : metrics.legitSuccessRate < 95
        ? "text-amber-400"
        : "text-emerald-400";

  const latencyColor =
    metrics.p99LatencyMs > 800
      ? "text-rose-400"
      : metrics.p99LatencyMs > 200
        ? "text-amber-400"
        : "text-sky-400";

  const speedLabel =
    metrics.p99LatencyMs > 800
      ? "Very Slow"
      : metrics.p99LatencyMs > 200
        ? "A Bit Sluggish"
        : "Instant!";

  return (
    <section
      aria-label="Live Website Status"
      className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 shrink-0"
    >
      {/* Website Health */}
      <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 px-3.5 py-2 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium">Website Health</span>
          <HeartPulse className={`w-3.5 h-3.5 ${healthColor}`} />
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className={`text-xl font-mono font-bold ${healthColor}`}>
            {metrics.originHealth}%
          </span>
          <span className={`text-[11px] font-medium ${healthColor}`}>
            {healthLabel}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${healthBarBg}`}
            style={{ width: `${metrics.originHealth}%` }}
          />
        </div>
      </div>

      {/* Happy Customers */}
      <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 px-3.5 py-2 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium">Happy Shoppers</span>
          <Smile className={`w-3.5 h-3.5 ${successColor}`} />
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className={`text-xl font-mono font-bold ${successColor}`}>
            {metrics.legitSuccessRate}%
          </span>
          <span className="text-[11px] text-slate-400">
            {metrics.legitSuccessRate >= 95 ? "Can Checkout" : "Seeing Errors"}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              metrics.legitSuccessRate < 70
                ? "bg-rose-500"
                : metrics.legitSuccessRate < 95
                  ? "bg-amber-400"
                  : "bg-emerald-400"
            }`}
            style={{ width: `${metrics.legitSuccessRate}%` }}
          />
        </div>
      </div>

      {/* Visitors Right Now */}
      <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 px-3.5 py-2 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium">Visitors / Second</span>
          <Users className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="mt-1 flex items-baseline gap-2 font-mono">
          <span className="text-sm font-bold text-emerald-400">
            {metrics.legitRps.toLocaleString()}
            <span className="text-[10px] font-sans font-normal text-slate-400 ml-1">
              real
            </span>
          </span>
          <span className="text-slate-600">vs</span>
          <span className="text-sm font-bold text-rose-400">
            {metrics.maliciousRps.toLocaleString()}
            <span className="text-[10px] font-sans font-normal text-slate-400 ml-1">
              bots
            </span>
          </span>
        </div>
        <div className="mt-1.5 text-[11px] text-slate-400 truncate">
          Shield Blocked:{" "}
          <span className="text-sky-400 font-mono font-semibold">
            {metrics.blockedRps.toLocaleString()}/s
          </span>
        </div>
      </div>

      {/* Page Load Speed */}
      <div className="rounded-lg border border-slate-800/90 bg-slate-900/70 px-3.5 py-2 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium">Page Load Time</span>
          <Timer className={`w-3.5 h-3.5 ${latencyColor}`} />
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className={`text-xl font-mono font-bold ${latencyColor}`}>
            {metrics.p99LatencyMs}
            <span className="text-xs font-normal ml-0.5">ms</span>
          </span>
          <span className={`text-[11px] font-medium ${latencyColor}`}>
            {speedLabel}
          </span>
        </div>
        <div className="mt-1.5 text-[11px] text-slate-400 truncate">
          Active Servers:{" "}
          <span className="text-slate-200 font-mono font-semibold">
            {metrics.activeNodes}
          </span>
        </div>
      </div>
    </section>
  );
}
