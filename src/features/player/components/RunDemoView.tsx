"use client";

import { useState } from "react";
import Link from "next/link";
import {
  INITIAL_MOCK_RACE_STATE,
  MOCK_CHECKPOINTS,
} from "@/lib/supabase";
import type { Checkpoint, RaceState } from "@/types/marathon";
import { usePlayerSession } from "../hooks/usePlayerSession";
import { useWakeLock } from "../hooks/useWakeLock";
import { RacePanel } from "./RacePanel";

/**
 * Temporary standalone view for /run while Dev A builds <HeartMap />.
 * Keeps src/app/run/page.tsx minimal so integrating HeartMap is conflict-free.
 */
export function RunDemoView() {
  const { session } = usePlayerSession();
  const [raceState, setRaceState] = useState<RaceState>(INITIAL_MOCK_RACE_STATE);

  const isGuide = session?.role === "guide";
  const { isActive: wakeLockActive } = useWakeLock(
    Boolean(isGuide && raceState.status === "running"),
  );

  const nextCheckpoint =
    MOCK_CHECKPOINTS.find(
      (cp) => !raceState.progress.completedCheckpointIds.includes(cp.id),
    ) ?? null;

  const handleStartDemoRace = () => {
    const nowIso = new Date().toISOString();
    setRaceState((prev) => ({
      ...prev,
      status: "running",
      progress: {
        ...prev.progress,
        startedAt: prev.progress.startedAt ?? nowIso,
        updatedAt: nowIso,
      },
    }));
  };

  const handleManualUnlock = (checkpoint: Checkpoint) => {
    const nowIso = new Date().toISOString();
    setRaceState((prev) => {
      if (prev.progress.completedCheckpointIds.includes(checkpoint.id)) {
        return prev;
      }

      const completedCheckpointIds = [
        ...prev.progress.completedCheckpointIds,
        checkpoint.id,
      ];
      const upcoming =
        MOCK_CHECKPOINTS.find(
          (cp) => !completedCheckpointIds.includes(cp.id),
        ) ?? null;
      const isFinished = upcoming === null;

      return {
        ...prev,
        status: isFinished ? "finished" : "running",
        progress: {
          ...prev.progress,
          startedAt: prev.progress.startedAt ?? nowIso,
          finishedAt: isFinished ? nowIso : prev.progress.finishedAt,
          currentKilometer: checkpoint.kilometer,
          completedCheckpointIds,
          currentLocation: checkpoint.coordinates,
          distanceToNextMeters: upcoming
            ? Math.max(
                50,
                Math.round((upcoming.kilometer - checkpoint.kilometer) * 1000),
              )
            : 0,
          updatedAt: nowIso,
        },
      };
    });
  };

  if (!session) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-neutral-50 p-6 text-center text-neutral-950">
        <h1 className="text-2xl font-extrabold">Elige tu rol primero</h1>
        <p className="max-w-xs text-sm font-medium text-neutral-600">
          Necesitas seleccionar si eres el Guía del Km 0 o parte del Pelotón para
          entrar a la carrera.
        </p>
        <Link
          href="/"
          className="flex min-h-12 items-center justify-center rounded-xl bg-rose-600 px-6 text-base font-bold text-white"
        >
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-neutral-100">
      {/* Top 65% slot reserved for <HeartMap /> (Dev A) */}
      <div className="relative flex min-h-[45dvh] flex-1 flex-col items-center justify-center gap-3 bg-gradient-to-b from-rose-50 to-neutral-200 p-6 text-center">
        <Link
          href="/"
          className="absolute top-4 left-4 flex min-h-10 items-center rounded-xl bg-white/90 px-3.5 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur"
        >
          ← Inicio
        </Link>

        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-700 shadow-sm">
          Zona de Mapa (Dev A — &lt;HeartMap /&gt;)
        </span>
        <p className="max-w-xs text-sm font-medium text-neutral-700">
          Estado actual:{" "}
          <strong className="font-extrabold text-neutral-950">
            {raceState.status}
          </strong>
        </p>

        {raceState.status === "not_started" && (
          <button
            type="button"
            onClick={handleStartDemoRace}
            className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-rose-600 px-5 text-sm font-extrabold text-white shadow-sm hover:bg-rose-700"
          >
            Iniciar carrera (Mock)
          </button>
        )}
      </div>

      {/* Bottom RacePanel (Dev B) */}
      <div className="mx-auto w-full max-w-lg">
        <RacePanel
          session={session}
          progress={raceState.progress}
          nextCheckpoint={nextCheckpoint}
          checkpoints={MOCK_CHECKPOINTS}
          onManualUnlock={isGuide ? handleManualUnlock : undefined}
          wakeLockActive={wakeLockActive}
        />
      </div>
    </main>
  );
}
