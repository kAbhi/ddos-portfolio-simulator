export type AttackVector = "UDP_SYN" | "HTTP_GET" | "SLOWLORIS";
export type ExperienceMode = "beginner" | "advanced";
export type UserRole = "defender" | "attacker";
export type GuidedStage = 1 | 2 | 3;

export interface DefenseConfig {
  rateLimiting: boolean;
  rateLimitThreshold: number; // 10 to 100 (lower = stricter, may clip real shoppers)
  cdnCaching: boolean;
  jsChallenge: boolean;
  connectionTimeoutsAndAutoScale: boolean;
}

export interface SimulationConfig {
  botnetSize: number; // 0 to 50,000
  legitBaseRps: number;
  attackVector: AttackVector;
  defenses: DefenseConfig;
}

export interface ServerNode {
  id: number;
  label: string;
  cpuLoad: number;
  connectionPool: number;
  status: "healthy" | "degraded" | "critical" | "warming";
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  message: string;
  severity: "info" | "warn" | "critical" | "success";
}

export interface TelemetryMetrics {
  originHealth: number;
  legitSuccessRate: number;
  legitRps: number;
  maliciousRps: number;
  blockedRps: number;
  cachedRps: number;
  originRps: number;
  p99LatencyMs: number;
  avgCpuLoad: number;
  avgConnPool: number;
  pipeSaturation: number;
  activeNodes: number;
  targetNodes: number;
  scaleWarmupProgress: number;
  nodes: ServerNode[];
  eventTicker: string;
  eventSeverity: "info" | "warn" | "critical" | "success";
  shieldActive: boolean;
  blockRatio: number;
}

export interface MissionDefinition {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  points: number;
  badge: string;
  scenario: string;
  objective: string;
  config: SimulationConfig;
  checkSuccess: (m: TelemetryMetrics, c: SimulationConfig) => boolean;
}

export interface InspectableEntity {
  kind: "customer" | "bot" | "shield" | "server";
  title: string;
  subtitle: string;
  details: string;
}