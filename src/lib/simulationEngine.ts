import {
  AttackVector,
  MissionDefinition,
  ServerNode,
  SimulationConfig,
  TelemetryMetrics,
} from "@/types/simulation";

export const INITIAL_CONFIG: SimulationConfig = {
  botnetSize: 0,
  legitBaseRps: 500,
  attackVector: "HTTP_GET",
  defenses: {
    rateLimiting: false,
    rateLimitThreshold: 60,
    cdnCaching: false,
    jsChallenge: false,
    connectionTimeoutsAndAutoScale: false,
  },
};

export const MISSIONS: MissionDefinition[] = [
  {
    id: "unexpected-crowd",
    title: "Mission 1: The Unexpected Crowd",
    difficulty: "Beginner",
    points: 100,
    badge: "Storefront Guardian",
    scenario:
        "A sudden flood of 15,000 fake visitors is overwhelming HappyMart. Activate protection and keep genuine customers shopping.",
    objective: "Reach ≥ 90% Customer Satisfaction and ≥ 75% Store Health.",
    config: {
      botnetSize: 15000,
      legitBaseRps: 500,
      attackVector: "UDP_SYN",
      defenses: {
        rateLimiting: false,
        rateLimitThreshold: 60,
        cdnCaching: false,
        jsChallenge: false,
        connectionTimeoutsAndAutoScale: false,
      },
    },
    checkSuccess: (m) => m.legitSuccessRate >= 90 && m.originHealth >= 75,
  },
  {
    id: "impatient-bots",
    title: "Mission 2: The Impatient Bots",
    difficulty: "Intermediate",
    points: 250,
    badge: "Cache Strategist",
    scenario:
        "35,000 bots are repeatedly requesting the same product pages. Reduce server load using Caching + Rate Limiting without blocking real shoppers.",
    objective: "Keep ≥ 92% Happy Shoppers and Origin CPU below 65%.",
    config: {
      botnetSize: 35000,
      legitBaseRps: 600,
      attackVector: "HTTP_GET",
      defenses: {
        rateLimiting: false,
        rateLimitThreshold: 60,
        cdnCaching: false,
        jsChallenge: false,
        connectionTimeoutsAndAutoScale: false,
      },
    },
    checkSuccess: (m, c) =>
        c.defenses.cdnCaching &&
        m.legitSuccessRate >= 92 &&
        m.avgCpuLoad < 65,
  },
  {
    id: "clever-attack",
    title: "Mission 3: The Clever Attack",
    difficulty: "Advanced",
    points: 500,
    badge: "Cybersecurity Architect",
    scenario:
        "Sneaky Slowloris bots are holding open connections to lock out real shoppers, bypassing basic rate limits. Adapt your defenses!",
    objective: "Keep Connection Pool < 60% and Customer Satisfaction ≥ 92%.",
    config: {
      botnetSize: 22000,
      legitBaseRps: 500,
      attackVector: "SLOWLORIS",
      defenses: {
        rateLimiting: true,
        rateLimitThreshold: 55,
        cdnCaching: true,
        jsChallenge: false,
        connectionTimeoutsAndAutoScale: false,
      },
    },
    checkSuccess: (m) => m.avgConnPool < 60 && m.legitSuccessRate >= 92,
  },
];

export interface SimulationInternalState {
  scaleWarmupTicks: number;
  tickCount: number;
}

export function createInitialInternalState(): SimulationInternalState {
  return { scaleWarmupTicks: 0, tickCount: 0 };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function getMaliciousRps(botnetSize: number, vector: AttackVector): number {
  if (botnetSize <= 0) return 0;
  switch (vector) {
    case "UDP_SYN":
      return Math.round(botnetSize * 0.85);
    case "HTTP_GET":
      return Math.round(botnetSize * 0.42);
    case "SLOWLORIS":
      return Math.round(botnetSize * 0.035);
  }
}

export function stepSimulation(
    config: SimulationConfig,
    internal: SimulationInternalState
): TelemetryMetrics {
  internal.tickCount += 1;
  const jitter = Math.sin(internal.tickCount * 0.7) * 0.03;

  const legitRps = Math.round(config.legitBaseRps * (1 + jitter));
  const rawMaliciousRps = Math.round(
      getMaliciousRps(config.botnetSize, config.attackVector) * (1 + jitter)
  );

  const {
    rateLimiting,
    rateLimitThreshold,
    cdnCaching,
    jsChallenge,
    connectionTimeoutsAndAutoScale,
  } = config.defenses;

  let maliciousPassRate = 1.0;
  let legitBlockedFraction = 0.0;
  let legitOriginPassRate = 1.0;
  let cachedRps = 0;

  if (rateLimiting) {
    // Lower threshold = stricter blocking, but higher false positives on real shoppers
    const strictness = clamp((100 - rateLimitThreshold) / 100, 0.1, 0.9);
    if (config.attackVector === "UDP_SYN") {
      maliciousPassRate *= clamp(0.65 - strictness * 0.5, 0.12, 0.65);
    } else if (config.attackVector === "HTTP_GET") {
      maliciousPassRate *= clamp(0.75 - strictness * 0.55, 0.18, 0.75);
    } else {
      maliciousPassRate *= 0.92;
    }
    if (rateLimitThreshold < 30) {
      legitBlockedFraction += (30 - rateLimitThreshold) * 0.012;
    } else if (legitRps > 2500) {
      legitBlockedFraction += 0.06;
    }
  }

  if (cdnCaching) {
    if (config.attackVector === "HTTP_GET") {
      const beforeCache = rawMaliciousRps * maliciousPassRate;
      maliciousPassRate *= 0.24;
      cachedRps = Math.round(beforeCache * 0.76 + legitRps * 0.65);
      legitOriginPassRate *= 0.35;
    } else if (config.attackVector === "UDP_SYN") {
      maliciousPassRate *= 0.78;
      cachedRps = Math.round(legitRps * 0.4);
    } else {
      maliciousPassRate *= 0.88;
      cachedRps = Math.round(legitRps * 0.4);
    }
  }

  if (jsChallenge) {
    if (config.attackVector === "HTTP_GET") {
      maliciousPassRate *= 0.12;
    } else if (config.attackVector === "SLOWLORIS") {
      maliciousPassRate *= 0.55;
    }
    legitBlockedFraction += 0.015;
  }

  const effectiveMaliciousRps = Math.round(rawMaliciousRps * maliciousPassRate);
  const blockedRps = Math.max(0, rawMaliciousRps - effectiveMaliciousRps);
  const blockRatio =
      rawMaliciousRps > 0 ? clamp(blockedRps / rawMaliciousRps, 0, 1) : 0;

  const originLegitRps = Math.round(
      legitRps * (1 - legitBlockedFraction) * legitOriginPassRate
  );
  const originRps = originLegitRps + effectiveMaliciousRps;

  // Auto-Scaling Warm-Up
  const baseNodes = 3;
  const maxNodes = 6;
  const needsScale =
      connectionTimeoutsAndAutoScale &&
      (originRps > 1100 ||
          (config.attackVector === "SLOWLORIS" && config.botnetSize > 4000));

  if (needsScale) {
    internal.scaleWarmupTicks = Math.min(16, internal.scaleWarmupTicks + 1);
  } else {
    internal.scaleWarmupTicks = Math.max(0, internal.scaleWarmupTicks - 2);
  }

  const scaleWarmupProgress = Math.round((internal.scaleWarmupTicks / 16) * 100);
  const extraNodes =
      internal.scaleWarmupTicks >= 16
          ? 3
          : internal.scaleWarmupTicks >= 10
              ? 2
              : internal.scaleWarmupTicks >= 5
                  ? 1
                  : 0;
  const activeNodes = baseNodes + extraNodes;
  const targetNodes = needsScale ? maxNodes : baseNodes;

  // Resource Saturation
  const totalCpuCapacity = activeNodes * 550;
  let cpuDemandRps = originLegitRps;
  if (config.attackVector === "HTTP_GET") cpuDemandRps += effectiveMaliciousRps * 1.15;
  else if (config.attackVector === "UDP_SYN") cpuDemandRps += effectiveMaliciousRps * 0.35;
  else cpuDemandRps += effectiveMaliciousRps * 0.12;

  const avgCpuLoad = clamp((cpuDemandRps / totalCpuCapacity) * 100, 4, 100);

  const totalSocketCapacity = activeNodes * 1200;
  let openSockets = originLegitRps * 0.45;
  if (config.attackVector === "SLOWLORIS") {
    const rawSockets = config.botnetSize * 0.45 * maliciousPassRate;
    openSockets += connectionTimeoutsAndAutoScale ? rawSockets * 0.06 : rawSockets;
  } else if (config.attackVector === "UDP_SYN") {
    openSockets += effectiveMaliciousRps * (connectionTimeoutsAndAutoScale ? 0.1 : 0.35);
  } else {
    openSockets += effectiveMaliciousRps * 0.25;
  }
  const avgConnPool = clamp((openSockets / totalSocketCapacity) * 100, 3, 100);

  const pipeDemand =
      config.attackVector === "UDP_SYN"
          ? originLegitRps + effectiveMaliciousRps * 1.4
          : originRps * 0.5;
  const pipeSaturation = clamp((pipeDemand / 18000) * 100, 2, 100);

  // Queuing Theory p99 Latency (L = λW)
  const rho = clamp(Math.max(avgCpuLoad, avgConnPool, pipeSaturation) / 100, 0.05, 0.985);
  const challengeOverhead = jsChallenge ? 35 : 0;
  const p99LatencyMs = Math.round(
      clamp(24 + 18 / (1 - rho) + challengeOverhead, 22, 4800)
  );

  // Health & Customer Satisfaction
  const bottleneck = Math.max(avgCpuLoad, avgConnPool, pipeSaturation);
  const originHealth = Math.round(
      bottleneck > 60
          ? clamp(100 - (bottleneck - 60) * 2.45, 0, 100)
          : clamp(100 - bottleneck * 0.12, 85, 100)
  );

  const dropRateAtOrigin = bottleneck > 75 ? clamp((bottleneck - 75) / 26, 0, 0.97) : 0;
  const legitSuccessRate = Math.round(
      clamp((1 - legitBlockedFraction) * (1 - dropRateAtOrigin) * 100, 0, 100)
  );

  const nodes: ServerNode[] = Array.from(
      { length: Math.max(activeNodes, targetNodes) },
      (_, i) => {
        const isWarming = i >= activeNodes;
        const variance = ((i % 3) - 1) * 3.5;
        const cpuLoad = isWarming ? 12 : clamp(Math.round(avgCpuLoad + variance), 3, 100);
        const connectionPool = isWarming
            ? 5
            : clamp(Math.round(avgConnPool - variance), 2, 100);
        const peak = Math.max(cpuLoad, connectionPool);
        return {
          id: i + 1,
          label: `Server #${i + 1}`,
          cpuLoad,
          connectionPool,
          status: isWarming
              ? "warming"
              : peak >= 85
                  ? "critical"
                  : peak >= 60
                      ? "degraded"
                      : "healthy",
        };
      }
  );

  // Plain-English Live Commentary
  let eventTicker = "Everything is working perfectly! Your customers are happily shopping at HappyMart.";
  let eventSeverity: TelemetryMetrics["eventSeverity"] = "info";

  if (config.attackVector === "SLOWLORIS" && avgConnPool >= 80 && avgCpuLoad < 40) {
    eventTicker = `Suspicious bots are holding open ${Math.round(avgConnPool)}% of your store's connections—real customers are locked out! Activate "Block Suspicious Visitors".`;
    eventSeverity = "critical";
  } else if (originHealth < 30) {
    eventTicker = `HappyMart is overwhelmed! Servers are struggling (response time ${p99LatencyMs}ms) and real customers are abandoning their carts.`;
    eventSeverity = "critical";
  } else if (rateLimiting && rateLimitThreshold < 25) {
    eventTicker = `Warning: Your Visitor Speed Limit is very strict (${rateLimitThreshold})—some genuine customers are being turned away!`;
    eventSeverity = "warn";
  } else if (scaleWarmupProgress > 0 && scaleWarmupProgress < 100) {
    eventTicker = `Bringing backup servers online (${scaleWarmupProgress}% ready) to absorb the traffic surge...`;
    eventSeverity = "warn";
  } else if (originHealth < 70) {
    eventTicker = `Something unusual is happening—your servers are under stress (${originHealth}% health). Activate defenses to protect HappyMart.`;
    eventSeverity = "warn";
  } else if (blockedRps > 1000 && legitSuccessRate >= 90) {
    eventTicker = `You saved HappyMart! Your defenses blocked ${blockedRps.toLocaleString()} fake requests/sec while ${legitSuccessRate}% of real customers shopped smoothly.`;
    eventSeverity = "success";
  }

  return {
    originHealth,
    legitSuccessRate,
    legitRps,
    maliciousRps: rawMaliciousRps,
    blockedRps,
    cachedRps,
    originRps,
    p99LatencyMs,
    avgCpuLoad: Math.round(avgCpuLoad),
    avgConnPool: Math.round(avgConnPool),
    pipeSaturation: Math.round(pipeSaturation),
    activeNodes,
    targetNodes,
    scaleWarmupProgress,
    nodes,
    eventTicker,
    eventSeverity,
    shieldActive:
        rateLimiting || cdnCaching || jsChallenge || connectionTimeoutsAndAutoScale,
    blockRatio,
  };
}