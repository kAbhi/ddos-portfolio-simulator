"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { GuidedStage } from "@/types/simulation";

interface OnboardingBannerProps {
    stage: GuidedStage;
    onSelectStage: (stage: GuidedStage) => void;
}

const STAGES: { id: GuidedStage; label: string; desc: string }[] = [
    {
        id: 1,
        label: "1. Business as Usual",
        desc: "500 genuine customers are shopping smoothly at HappyMart.",
    },
    {
        id: 2,
        label: "2. The Attack Begins",
        desc: "15,000 fake bots flood your store! Watch servers slow down.",
    },
    {
        id: 3,
        label: "3. Save HappyMart",
        desc: "Activate defenses below to block bots and restore happy shoppers.",
    },
];

export function OnboardingBanner({ stage, onSelectStage }: OnboardingBannerProps) {
    return (
        <div className="px-5 py-2 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
                {STAGES.map((s) => {
                    const active = stage === s.id;
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => onSelectStage(s.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                                active
                                    ? s.id === 2
                                        ? "bg-rose-500/20 border-rose-500/50 text-rose-200"
                                        : "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {s.id === 1 && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {s.id === 2 && <AlertTriangle className="w-3.5 h-3.5" />}
                            {s.id === 3 && <ShieldCheck className="w-3.5 h-3.5" />}
                            {s.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>{STAGES[stage - 1].desc}</span>
                {stage < 3 && (
                    <button
                        type="button"
                        onClick={() => onSelectStage((stage + 1) as GuidedStage)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-medium cursor-pointer"
                    >
                        Next <ArrowRight className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}