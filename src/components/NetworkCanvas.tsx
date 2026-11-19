"use client";

import React, { useEffect, useRef, useState } from "react";
import { InspectableEntity, TelemetryMetrics } from "@/types/simulation";
import { X } from "lucide-react";

interface NetworkCanvasProps {
  metricsRef: React.MutableRefObject<TelemetryMetrics>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "legit" | "malicious";
  deflected: boolean;
  alpha: number;
  radius: number;
}

export function NetworkCanvas({ metricsRef }: NetworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inspected, setInspected] = useState<InspectableEntity | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const m = metricsRef.current;

    if (x < w * 0.28) {
      if (y < h * 0.5) {
        setInspected({
          kind: "customer",
          title: "Genuine HappyMart Shoppers",
          subtitle: `${m.legitRps.toLocaleString()} real visitors / second`,
          details:
              "Real people browsing products and checking out. Green particles represent legitimate traffic you want to protect.",
        });
      } else {
        setInspected({
          kind: "bot",
          title: "Automated Bot Army",
          subtitle: `${m.maliciousRps.toLocaleString()} fake requests / second`,
          details:
              "Suspicious automated scripts flooding HappyMart with junk requests to exhaust your servers and block real shoppers.",
        });
      }
    } else if (x >= w * 0.38 && x <= w * 0.6) {
      setInspected({
        kind: "shield",
        title: "Security Checkpoint (Edge Shield)",
        subtitle: m.shieldActive
            ? `Active · Blocking ${m.blockedRps.toLocaleString()} req/s`
            : "Inactive · All traffic passes unchecked",
        details:
            "Inspects incoming visitors before they reach HappyMart. Combines Rate Limiting, Human Verification, Caching, and Bot Blocking.",
      });
    } else if (x > w * 0.68) {
      setInspected({
        kind: "server",
        title: "HappyMart Store Servers",
        subtitle: `${m.activeNodes} active servers · CPU ${m.avgCpuLoad}% · Connections ${m.avgConnPool}%`,
        details:
            "The computers powering your online store. When CPU or open connections hit 100%, real shoppers experience slow loads or errors.",
      });
    } else {
      setInspected(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    const particles: Particle[] = [];
    let shieldPulse = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(300, Math.floor(rect.width * dpr));
      canvas.height = Math.max(180, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const render = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const m = metricsRef.current;

      ctx.clearRect(0, 0, w, h);

      // Subtle background grid
      ctx.strokeStyle = "rgba(30, 41, 59, 0.35)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 36) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 36) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const leftX = Math.max(96, w * 0.13);
      const shieldX = w * 0.48;
      const rightX = Math.min(w - 135, w * 0.84);
      const legitY = h * 0.3;
      const botY = h * 0.72;

      // Spawn Real Shoppers
      if (Math.random() < Math.min(0.65, m.legitRps / 2200 + 0.12) && particles.length < 240) {
        particles.push({
          x: leftX + 44,
          y: legitY + (Math.random() - 0.5) * 18,
          vx: 3.2 + Math.random() * 1.2,
          vy: (h * 0.5 - legitY) / ((rightX - leftX) / 3.5) + (Math.random() - 0.5) * 0.35,
          type: "legit",
          deflected: false,
          alpha: 0.95,
          radius: 3.5,
        });
      }

      // Spawn Bots
      if (m.maliciousRps > 0 && particles.length < 320) {
        const burst = Math.min(6, Math.ceil(m.maliciousRps / 3500));
        for (let i = 0; i < burst; i++) {
          if (Math.random() < 0.75) {
            particles.push({
              x: leftX + 44,
              y: botY + (Math.random() - 0.5) * 28,
              vx: 3.8 + Math.random() * 1.8,
              vy: (h * 0.5 - botY) / ((rightX - leftX) / 4.2) + (Math.random() - 0.5) * 0.6,
              type: "malicious",
              deflected: false,
              alpha: 0.92,
              radius: 3,
            });
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === "malicious" && !p.deflected && Math.abs(p.x - shieldX) <= 8) {
          if (m.shieldActive && Math.random() < m.blockRatio) {
            p.deflected = true;
            p.vx = -(1.5 + Math.random() * 2.2);
            p.vy = (Math.random() > 0.5 ? 1 : -1) * (2.2 + Math.random() * 2.8);
            shieldPulse = Math.min(1, shieldPulse + 0.12);
          }
        }

        if (p.deflected) p.alpha -= 0.045;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
            p.type === "legit"
                ? `rgba(52, 211, 153, ${p.alpha})`
                : p.deflected
                    ? `rgba(56, 189, 248, ${p.alpha})`
                    : `rgba(251, 113, 133, ${p.alpha})`;
        ctx.fill();

        if (p.alpha <= 0.02 || p.x > rightX - 65 || p.x < 10 || p.y < 0 || p.y > h) {
          particles.splice(i, 1);
        }
      }

      shieldPulse = Math.max(0, shieldPulse - 0.025);

      const drawBox = (
          cx: number,
          cy: number,
          title: string,
          sub: string,
          border: string
      ) => {
        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx - 64, cy - 28, 128, 56, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f1f5f9";
        ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(title, cx, cy - 5);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "500 10px ui-monospace, SFMono-Regular, monospace";
        ctx.fillText(sub, cx, cy + 13);
      };

      drawBox(leftX, legitY, "Genuine Shoppers", `${m.legitRps.toLocaleString()} / sec`, "rgba(52, 211, 153, 0.8)");
      drawBox(leftX, botY, "Malicious Bots", `${m.maliciousRps.toLocaleString()} / sec`, m.maliciousRps > 0 ? "rgba(251, 113, 133, 0.85)" : "rgba(71, 85, 105, 0.6)");

      // Security Checkpoint
      const shieldTop = h * 0.14;
      const shieldHeight = h * 0.72;
      ctx.strokeStyle = m.shieldActive
          ? `rgba(56, 189, 248, ${0.45 + shieldPulse * 0.55})`
          : "rgba(100, 116, 139, 0.35)";
      ctx.lineWidth = m.shieldActive ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(shieldX, shieldTop);
      ctx.lineTo(shieldX, shieldTop + shieldHeight);
      ctx.stroke();

      drawBox(
          shieldX,
          shieldTop - 10,
          "Security Checkpoint",
          m.shieldActive ? "SHIELD ACTIVE" : "SHIELD OFF",
          m.shieldActive ? "rgba(56, 189, 248, 0.8)" : "rgba(71, 85, 105, 0.6)"
      );

      // HappyMart Servers
      const nodes = m.nodes;
      const nodeH = Math.min(42, Math.max(28, (h - 40) / nodes.length - 8));
      const totalH = nodes.length * nodeH + (nodes.length - 1) * 7;
      const startY = (h - totalH) / 2;

      nodes.forEach((node, idx) => {
        const ny = startY + idx * (nodeH + 7);
        const nx = rightX - 62;
        const nw = 138;
        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.strokeStyle =
            node.status === "critical"
                ? "rgba(251, 113, 133, 0.85)"
                : node.status === "degraded"
                    ? "rgba(251, 191, 36, 0.8)"
                    : "rgba(52, 211, 153, 0.6)";
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.roundRect(nx, ny, nw, nodeH, 7);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(node.label, nx + 8, ny + 13);

        const barW = nw - 48;
        ctx.fillStyle = "rgba(30, 41, 59, 0.95)";
        ctx.fillRect(nx + 38, ny + nodeH - 16, barW, 4);
        ctx.fillStyle = node.cpuLoad >= 85 ? "#fb7185" : node.cpuLoad >= 60 ? "#fbbf24" : "#34d399";
        ctx.fillRect(nx + 38, ny + nodeH - 16, (barW * node.cpuLoad) / 100, 4);

        ctx.fillStyle = "rgba(30, 41, 59, 0.95)";
        ctx.fillRect(nx + 38, ny + nodeH - 8, barW, 4);
        ctx.fillStyle = node.connectionPool >= 85 ? "#fb7185" : "#38bdf8";
        ctx.fillRect(nx + 38, ny + nodeH - 8, (barW * node.connectionPool) / 100, 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [metricsRef]);

  return (
      <div ref={containerRef} className="relative flex-1 min-h-[210px] w-full bg-slate-950 overflow-hidden">
        <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            title="Click any element (Shoppers, Bots, Checkpoint, or Servers) to inspect!"
            className="block w-full h-full cursor-pointer"
        />
        <div className="absolute bottom-2 left-3 text-[11px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
          Tip: Click Shoppers, Bots, Security Checkpoint, or Servers to inspect
        </div>

        {inspected && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-80 rounded-lg border border-sky-500/40 bg-slate-900/95 p-3 shadow-xl backdrop-blur">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-100">{inspected.title}</h3>
                  <p className="text-[11px] font-mono text-sky-400">{inspected.subtitle}</p>
                </div>
                <button
                    type="button"
                    onClick={() => setInspected(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{inspected.details}</p>
            </div>
        )}
      </div>
  );
}