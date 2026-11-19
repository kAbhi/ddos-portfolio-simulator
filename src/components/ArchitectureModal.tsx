"use client";

import React from "react";
import { X, Sparkles, Code2, Sigma } from "lucide-react";

interface ArchitectureModalProps {
  open: boolean;
  onClose: () => void;
}

export function ArchitectureModal({ open, onClose }: ArchitectureModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How It Works Modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <h2 className="text-sm font-semibold text-slate-100">
            How It Works — Simple Story &amp; Engineering Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-300 leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Plain English Section for Recruiters */}
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/20 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>The 30-Second Story (For Everyone)</span>
            </div>
            <p>
              Imagine your website is a busy coffee shop.{" "}
              <strong className="text-emerald-300">Green dots</strong> are real
              customers trying to buy coffee.{" "}
              <strong className="text-rose-300">Red dots</strong> are fake bots
              trying to jam the doors so real customers give up and leave.
            </p>
            <p className="text-slate-400">
              Your job is to flip on the right{" "}
              <strong className="text-sky-300">Defense Shield</strong> tools—like
              a Bouncer (Rate Limiter), a Fast-Lane Counter (CDN Cache), or
              extra Backup Servers—to keep real shoppers happy without slowing
              them down!
            </p>
          </div>

          {/* Engineering Section for Hiring Managers / Engineers */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-semibold">
              <Sigma className="w-4 h-4" />
              <span>Under the Hood: Queuing Theory (L = λW)</span>
            </div>
            <p className="text-slate-400">
              Page load time isn&apos;t linear. As server utilization (
              <code className="text-sky-300">ρ</code>) nears 100%, wait times
              spike exponentially using an <code className="text-sky-300">M/M/c</code>{" "}
              queuing approximation:
            </p>
            <div className="font-mono text-[11px] bg-slate-900 border border-slate-800 rounded p-2 text-emerald-300">
              p99_ms = base + service_time / (1 - min(ρ, 0.985)) + challenge_delay
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Code2 className="w-4 h-4" />
              <span>Frontend Architecture (Next.js 16 + TypeScript)</span>
            </div>
            <p className="text-slate-400">
              Built with zero backend dependencies using a{" "}
              <strong className="text-slate-200">dual-loop architecture</strong>:
              a pure TypeScript simulation engine updates metrics every 250ms,
              while a 60fps HTML5 <code className="text-slate-300">&lt;canvas&gt;</code>{" "}
              reads state via <code className="text-slate-300">useRef</code> for
              butter-smooth particle physics without React re-render lag.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
