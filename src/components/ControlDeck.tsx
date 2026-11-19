"use client";

import React from "react";
import { Flame, Trophy, MessageSquare, CheckCircle2 } from "lucide-react";
import {
  AttackVector,
  DefenseConfig,
  ExperienceMode,
  SimulationConfig,
  TelemetryMetrics,
  TimelineEvent,
  UserRole,
} from "@/types/simulation";
import { MISSIONS } from "@/lib/simulationEngine";

interface ControlDeckProps {
  config: SimulationConfig;
  metrics: TelemetryMetrics;
  mode: ExperienceMode;
  role: UserRole;
  activeMissionId: string | null;
  completedMissions: string[];
  timeline: TimelineEvent[];
  onChange: (next: SimulationConfig) => void;
  onStartMission: (missionId: string) => void;
}

const DEFENSE_CARDS: {
  key: keyof Omit<DefenseConfig, "rateLimitThreshold">;
  friendly: string;
  tech: string;
  tooltip: string;
}[] = [
  {
    key: "rateLimiting",
    friendly: "Visitor Speed Limit",
    tech: "Rate Limiting",
    tooltip: "Limits requests per visitor. Trade-off: too strict may block real shoppers.",
  },
  {
    key: "jsChallenge",
    friendly: "Prove You're Human",
    tech: "CAPTCHA / JS Check",
    tooltip: "Challenges suspicious bots before entry. Trade-off: adds ~35ms delay.",
  },
  {
    key: "cdnCaching",
    friendly: "Serve Products Faster",
    tech: "CDN / Caching",
    tooltip: "Serves popular pages from cache to reduce server load. Doesn't block all bots.",
  },
  {
    key: "connectionTimeoutsAndAutoScale",
    friendly: "Block Bots & Auto-Scale",
    tech: "Bot Firewall + Scale",
    tooltip: "Drops idle Slowloris sockets and adds backup servers (~4s warm-up).",
  },
];

export function ControlDeck({
                              config,
                              metrics,
                              activeMissionId,
                              completedMissions,
                              timeline,
                              onChange,
                              onStartMission,
                            }: ControlDeckProps) {
  const toggleDefense = (key: keyof Omit<DefenseConfig, "rateLimitThreshold">) => {
    onChange({
      ...config,
      defenses: { ...config.defenses, [key]: !config.defenses[key] },
    });
  };

  return (
      <section className="border-t border-slate-800 bg-slate-950/95 px-4 py-2 shrink-0 flex flex-col gap-2">
        {/* Slim Mission Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 shrink-0">
          <Trophy className="w-3 h-3" /> Missions:
        </span>
          {MISSIONS.map((m) => {
            const done = completedMissions.includes(m.id);
            const active = activeMissionId === m.id;
            return (
                <button
                    key={m.id}
                    type="button"
                    title={`${m.scenario} (${m.objective})`}
                    onClick={() => onStartMission(m.id)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border shrink-0 transition-colors cursor-pointer ${
                        active
                            ? "bg-amber-500/20 border-amber-400 text-amber-200"
                            : done
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                >
                  {done && <CheckCircle2 className="w-3 h-3" />}
                  <span>{m.title}</span>
                  <span className="text-[10px] opacity-75">+{m.points}</span>
                </button>
            );
          })}
        </div>

        {/* Compact 12-Column Control Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* Left (3 cols): Attack Controls */}
          <div className="lg:col-span-3 rounded-lg border border-rose-500/30 bg-slate-900/70 p-2 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-rose-400">
            <span className="inline-flex items-center gap-1">
              <Flame className="w-3 h-3" /> 1. Bot Attack
            </span>
              <span className="font-mono text-rose-300">
              {config.botnetSize.toLocaleString()} bots
            </span>
            </div>
            <input
                type="range"
                min={0}
                max={50000}
                step={1000}
                value={config.botnetSize}
                onChange={(e) =>
                    onChange({ ...config, botnetSize: Number(e.target.value) })
                }
                aria-label="Botnet Size"
                className="w-full h-1.5 accent-rose-500 cursor-pointer"
            />
            <div className="grid grid-cols-3 gap-1">
              {(
                  [
                    { id: "UDP_SYN", label: "UDP Jam" },
                    { id: "HTTP_GET", label: "HTTP Spam" },
                    { id: "SLOWLORIS", label: "Slowloris" },
                  ] as { id: AttackVector; label: string }[]
              ).map((v) => (
                  <button
                      key={v.id}
                      type="button"
                      onClick={() => onChange({ ...config, attackVector: v.id })}
                      className={`py-1 px-1 rounded text-[10px] font-medium border cursor-pointer transition-colors ${
                          config.attackVector === v.id
                              ? "bg-rose-500/20 border-rose-400 text-rose-200"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    {v.label}
                  </button>
              ))}
            </div>
          </div>

          {/* Center (6 cols): 2x2 Compact Defense Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-1.5">
            {DEFENSE_CARDS.map((card) => {
              const enabled = config.defenses[card.key];
              return (
                  <div
                      key={card.key}
                      title={card.tooltip}
                      className={`rounded-lg border px-2.5 py-1.5 flex flex-col justify-between transition-all ${
                          enabled
                              ? "bg-sky-500/10 border-sky-400/60"
                              : "bg-slate-900/70 border-slate-800"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-slate-100 truncate">
                          {card.friendly}
                        </div>
                        <div className="text-[10px] font-mono text-sky-400 truncate">
                          {card.tech}
                        </div>
                      </div>
                      <button
                          type="button"
                          onClick={() => toggleDefense(card.key)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 cursor-pointer ${
                              enabled
                                  ? "bg-sky-400 text-slate-950"
                                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                      >
                        {enabled ? "ON" : "OFF"}
                      </button>
                    </div>

                    {card.key === "rateLimiting" && enabled && (
                        <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-400">Limit:</span>
                          <input
                              type="range"
                              min={10}
                              max={95}
                              value={config.defenses.rateLimitThreshold}
                              onChange={(e) =>
                                  onChange({
                                    ...config,
                                    defenses: {
                                      ...config.defenses,
                                      rateLimitThreshold: Number(e.target.value),
                                    },
                                  })
                              }
                              className="flex-1 h-1 accent-sky-400 cursor-pointer"
                          />
                          <span className="text-[9px] font-mono text-sky-300">
                      {config.defenses.rateLimitThreshold}
                    </span>
                        </div>
                    )}
                  </div>
              );
            })}
          </div>

          {/* Right (3 cols): Live Commentary */}
          <div className="lg:col-span-3 rounded-lg border border-slate-800 bg-slate-900/80 p-2 flex flex-col justify-between gap-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-400">
              <MessageSquare className="w-3 h-3 shrink-0" />
              <span>What&apos;s happening?</span>
            </div>
            <p className="text-[11px] text-slate-200 font-medium leading-tight line-clamp-2">
              {metrics.eventTicker}
            </p>
            {timeline[0] && (
                <div className="text-[10px] text-slate-400 truncate border-t border-slate-800/80 pt-1">
                  <span className="font-mono text-slate-500 mr-1">{timeline[0].timestamp}</span>
                  {timeline[0].message}
                </div>
            )}
          </div>
        </div>
      </section>
  );
}