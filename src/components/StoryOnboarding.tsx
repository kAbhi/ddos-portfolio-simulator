"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Gauge,
  UserCheck,
  Zap,
  ShieldAlert,
  Server,
  Users,
  Bot,
  Sparkles,
} from "lucide-react";
import {
  HappyMartStoreIllustration,
  AttackFlowIllustration,
} from "@/components/StoryIllustrations";

interface StoryOnboardingProps {
  onComplete: () => void;
}

const TOTAL_SCREENS = 5;

export function StoryOnboarding({ onComplete }: StoryOnboardingProps) {
  const [step, setStep] = useState<number>(0);

  const next = () => {
    if (step < TOTAL_SCREENS - 1) setStep((s) => s + 1);
    else onComplete();
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Progress Bar */}
      <header className="w-full max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-100">
            HappyMart Security Lab
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-label="Story progress">
            {Array.from({ length: TOTAL_SCREENS }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStep(idx)}
                aria-label={`Go to step ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === step
                    ? "w-6 bg-emerald-400"
                    : idx < step
                      ? "w-2 bg-emerald-500/50"
                      : "w-2 bg-slate-700"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 cursor-pointer"
          >
            Skip to Simulator
          </button>
        </div>
      </header>

      {/* Main Story Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-6 sm:p-10 shadow-2xl">
          {/* SCREEN 1: Welcome to HappyMart */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <HappyMartStoreIllustration />
              <div className="space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Cybersecurity Story
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Welcome to HappyMart!
                </h1>
                <div className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  <p>
                    Imagine you own an online store. People visit your website to
                    browse clothes, add things to their carts, and place orders.
                  </p>
                  <p>
                    Everything is going well. Suddenly,{" "}
                    <strong className="text-rose-400">
                      thousands of fake visitors arrive simultaneously.
                    </strong>
                  </p>
                  <p className="text-rose-300 font-medium">
                    Your real customers can&apos;t access your store anymore!
                  </p>
                  <p className="text-white font-semibold">
                    Can you protect your business?
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Start the challenge
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: Business as Usual (Core Concepts) */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Chapter 1 · Business as Usual
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  How Your Online Store Works
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every day, genuine customers visit HappyMart. Behind the scenes,
                  your website is powered by <strong className="text-sky-300">servers</strong>{" "}
                  that greet each visitor and hand them product pages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-500/30 bg-slate-950/70 p-4 space-y-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Genuine Customers
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">
                    Legitimate Traffic
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real shoppers browsing products and checking out. Shown as{" "}
                    <strong className="text-emerald-300">green dots</strong> in the lab.
                  </p>
                </div>

                <div className="rounded-xl border border-sky-500/30 bg-slate-950/70 p-4 space-y-2">
                  <Server className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    The Store Computer
                  </h3>
                  <p className="text-xs text-sky-400 font-mono">Origin Server</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Handles every visitor&apos;s request. It has limited{" "}
                    <strong className="text-slate-200">CPU (Brain)</strong> and{" "}
                    <strong className="text-slate-200">Open Connections (Doors)</strong>.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-sky-300" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Security Guard
                  </h3>
                  <p className="text-xs text-sky-300 font-mono">
                    Firewall / Edge Shield
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sits in front of your store to inspect visitors and block
                    troublemakers before they reach your servers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: What is a DDoS Attack? */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                  Chapter 2 · The Attack Begins
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  What Is a DDoS Attack?
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A <strong className="text-rose-400">DDoS (Distributed Denial of Service)</strong>{" "}
                  attack happens when an attacker sends thousands of automated{" "}
                  <strong className="text-rose-300">fake visitors (bots)</strong>{" "}
                  at your store all at once. They aren&apos;t buying anything—they
                  just want to clog your servers so real shoppers can&apos;t get in.
                </p>
              </div>

              <AttackFlowIllustration />

              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 flex items-start gap-3">
                <Bot className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-200 leading-relaxed">
                  <strong>Why it hurts your business:</strong> As server load hits
                  100%, page load times skyrocket from milliseconds to several
                  seconds. Genuine customers see error screens and abandon their
                  shopping carts.
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 4: Your 4 Defense Superpowers */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Chapter 3 · Your Defense Toolkit
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  4 Ways to Save HappyMart
                </h2>
                <p className="text-sm text-slate-300">
                  In the simulator, you can combine these four real-world
                  cybersecurity defenses. Each one solves a different problem—and
                  has a real trade-off!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <Gauge className="w-4 h-4" /> Set a Visitor Speed Limit
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Technical name: Rate Limiting
                  </div>
                  <p className="text-xs text-slate-300">
                    Limits how fast any single visitor can knock on your door.
                    Careful: too strict and you might accidentally slow down real
                    shoppers!
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <UserCheck className="w-4 h-4" /> Ask Visitors to Prove They&apos;re Human
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Technical name: CAPTCHA / Human Verification
                  </div>
                  <p className="text-xs text-slate-300">
                    Challenges suspicious visitors to prove they use a real
                    browser. Stops most bots, with a tiny ~35ms delay.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <Zap className="w-4 h-4" /> Serve Popular Products Faster
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Technical name: CDN / Caching
                  </div>
                  <p className="text-xs text-slate-300">
                    Delivers popular pages from nearby cached copies so your main
                    server doesn&apos;t have to do all the work.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" /> Block Suspicious Visitors &amp; Scale
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Technical name: Bot Firewall &amp; Auto-Scaling
                  </div>
                  <p className="text-xs text-slate-300">
                    Boots sneaky bots that hog open connections and automatically
                    brings extra backup servers online.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: Ready to Play */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  You&apos;re Ready to Protect HappyMart!
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Inside the lab, you&apos;ll start with a healthy store, watch a
                  real-time attack unfold, and activate the right defenses to keep
                  your customers happy. You can also click any visitor, shield, or
                  server on screen to inspect it!
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onComplete}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  Enter HappyMart Security Lab
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation (for Steps 1-3) */}
          {step > 0 && step < TOTAL_SCREENS - 1 && (
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <span className="text-xs text-slate-500 font-mono">
                {step + 1} / {TOTAL_SCREENS}
              </span>

              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors cursor-pointer"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === TOTAL_SCREENS - 1 && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={prev}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Defense Toolkit
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
