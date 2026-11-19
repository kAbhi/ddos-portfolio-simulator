"use client";

import React, { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { OnboardingBanner } from "@/components/OnboardingBanner";
import { TelemetryBar } from "@/components/TelemetryBar";
import { NetworkCanvas } from "@/components/NetworkCanvas";
import { ControlDeck } from "@/components/ControlDeck";
import { ArchitectureModal } from "@/components/ArchitectureModal";
import {
    createInitialInternalState,
    INITIAL_CONFIG,
    MISSIONS,
    stepSimulation,
} from "@/lib/simulationEngine";
import {
    ExperienceMode,
    GuidedStage,
    SimulationConfig,
    TelemetryMetrics,
    TimelineEvent,
    UserRole,
} from "@/types/simulation";

interface DdosSimulatorProps {
    onReplayStory?: () => void;
}
export function DdosSimulator({ onReplayStory }: DdosSimulatorProps) {
    const [config, setConfig] = useState<SimulationConfig>(INITIAL_CONFIG);
    const [mode, setMode] = useState<ExperienceMode>("beginner");
    const [role, setRole] = useState<UserRole>("defender");
    const [stage, setStage] = useState<GuidedStage>(1);
    const [modalOpen, setModalOpen] = useState(false);

    const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
    const [completedMissions, setCompletedMissions] = useState<string[]>([]);
    const [points, setPoints] = useState(0);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

    const internalRef = useRef(createInitialInternalState());
    const configRef = useRef<SimulationConfig>(config);
    configRef.current = config;

    const [metrics, setMetrics] = useState<TelemetryMetrics>(() =>
        stepSimulation(INITIAL_CONFIG, createInitialInternalState())
    );
    const metricsRef = useRef<TelemetryMetrics>(metrics);
    metricsRef.current = metrics;

    const lastTickerRef = useRef<string>("");

    const pushEvent = (message: string, severity: TimelineEvent["severity"]) => {
        const now = new Date().toLocaleTimeString([], {
            hour12: false,
            minute: "2-digit",
            second: "2-digit",
        });
        setTimeline((prev) => [
            { id: `${Date.now()}-${Math.random()}`, timestamp: now, message, severity },
            ...prev.slice(0, 14),
        ]);
    };

    useEffect(() => {
        const id = window.setInterval(() => {
            const next = stepSimulation(configRef.current, internalRef.current);
            metricsRef.current = next;
            setMetrics(next);

            if (next.eventTicker !== lastTickerRef.current) {
                lastTickerRef.current = next.eventTicker;
                pushEvent(next.eventTicker, next.eventSeverity);
            }
        }, 250);
        return () => window.clearInterval(id);
    }, []);

    // Mission completion check
    useEffect(() => {
        if (!activeMissionId || completedMissions.includes(activeMissionId)) return;
        const mission = MISSIONS.find((m) => m.id === activeMissionId);
        if (mission && mission.checkSuccess(metrics, config)) {
            setCompletedMissions((prev) => [...prev, mission.id]);
            setPoints((p) => p + mission.points);
            pushEvent(
                `Mission Complete: ${mission.title}! Earned +${mission.points} pts & "${mission.badge}" badge.`,
                "success"
            );
        }
    }, [metrics, config, activeMissionId, completedMissions]);

    const handleSelectStage = (nextStage: GuidedStage) => {
        setStage(nextStage);
        setActiveMissionId(null);
        if (nextStage === 1) {
            setConfig(INITIAL_CONFIG);
        } else if (nextStage === 2) {
            setConfig({
                ...INITIAL_CONFIG,
                botnetSize: 15000,
                attackVector: "HTTP_GET",
            });
        } else {
            setConfig({
                ...INITIAL_CONFIG,
                botnetSize: 15000,
                attackVector: "HTTP_GET",
                defenses: {
                    ...INITIAL_CONFIG.defenses,
                    rateLimiting: true,
                    cdnCaching: true,
                },
            });
        }
    };

    const handleStartMission = (missionId: string) => {
        const mission = MISSIONS.find((m) => m.id === missionId);
        if (!mission) return;
        setActiveMissionId(mission.id);
        setConfig(mission.config);
        pushEvent(`Started ${mission.title}: ${mission.objective}`, "info");
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
            <Header
                mode={mode}
                role={role}
                points={points}
                onModeChange={setMode}
                onRoleChange={setRole}
                onOpenModal={() => setModalOpen(true)}
                onReplayStory={onReplayStory}
            />
            {mode === "beginner" && (
                <OnboardingBanner stage={stage} onSelectStage={handleSelectStage} />
            )}
            <TelemetryBar metrics={metrics} />
            <main className="flex-1 min-h-[140px] w-full flex flex-col overflow-hidden">
                <NetworkCanvas metricsRef={metricsRef} />
            </main>
            <ControlDeck
                config={config}
                metrics={metrics}
                mode={mode}
                role={role}
                activeMissionId={activeMissionId}
                completedMissions={completedMissions}
                timeline={timeline}
                onChange={setConfig}
                onStartMission={handleStartMission}
            />
            <ArchitectureModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}