"use client";

import React from "react";
import { Shield, Swords, Sparkles, Trophy, RotateCcw } from "lucide-react";
import { ExperienceMode, UserRole } from "@/types/simulation";

interface HeaderProps {
    mode: ExperienceMode;
    role: UserRole;
    points: number;
    onModeChange: (m: ExperienceMode) => void;
    onRoleChange: (r: UserRole) => void;
    onOpenModal: () => void;
    onReplayStory?: () => void;
}

export function Header({
                           mode,
                           role,
                           points,
                           onModeChange,
                           onRoleChange,
                           onOpenModal,
                           onReplayStory,
                       }: HeaderProps) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 border-b border-slate-800/90 bg-slate-950/95 shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Shield className="w-4 h-4" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm font-bold tracking-tight text-slate-100">
                            HappyMart Security Lab
                        </h1>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
              LOCAL SIMULATION
            </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Interactive DDoS Learning Playground · Built by Abhishek Sharma
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {/* Points Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{points} pts</span>
                </div>

                {/* Role Switch */}
                <div className="inline-flex rounded-md border border-slate-800 bg-slate-900 p-0.5 text-xs">
                    <button
                        type="button"
                        onClick={() => onRoleChange("defender")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            role === "defender"
                                ? "bg-sky-500/20 text-sky-300 font-medium"
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Shield className="w-3 h-3" /> Defender
                    </button>
                    <button
                        type="button"
                        onClick={() => onRoleChange("attacker")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            role === "attacker"
                                ? "bg-rose-500/20 text-rose-300 font-medium"
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Swords className="w-3 h-3" /> Attacker
                    </button>
                </div>

                {/* Beginner / Advanced Mode Switch */}
                <div className="inline-flex rounded-md border border-slate-800 bg-slate-900 p-0.5 text-xs">
                    <button
                        type="button"
                        onClick={() => onModeChange("beginner")}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            mode === "beginner"
                                ? "bg-emerald-500/20 text-emerald-300 font-medium"
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        Beginner
                    </button>
                    <button
                        type="button"
                        onClick={() => onModeChange("advanced")}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            mode === "advanced"
                                ? "bg-purple-500/20 text-purple-300 font-medium"
                                : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        Advanced
                    </button>
                </div>

                {onReplayStory && (
                    <button
                        type="button"
                        onClick={onReplayStory}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Replay Story</span>
                    </button>
                )}

                <button
                    type="button"
                    onClick={onOpenModal}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer"
                >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Guide</span>
                </button>
            </div>
        </header>
    );
}