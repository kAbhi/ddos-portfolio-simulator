"use client";

import React, { useState } from "react";
import { StoryOnboarding } from "@/components/StoryOnboarding";
import { DdosSimulator } from "@/components/DdosSimulator";

export function AppShell() {
    const [showStory, setShowStory] = useState<boolean>(true);

    if (showStory) {
        return <StoryOnboarding onComplete={() => setShowStory(false)} />;
    }

    return <DdosSimulator onReplayStory={() => setShowStory(true)} />;
}