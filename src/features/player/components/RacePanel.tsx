"use client";

import { useEffect, useState } from "react";
import type {
  Checkpoint,
  PlayerSession,
  RaceProgress,
} from "@/types/marathon";
import { PelotonBar } from "./PelotonBar";

export interface RacePanelProps {
  session: PlayerSession;
  progress: RaceProgress;
  nextCheckpoint: Checkpoint | null;
  checkpoints: Checkpoint[];
  onManualUnlock?: (checkpoint: Checkpoint) => void;
  wakeLockActive?: boolean;
}

const TOTAL_DISTANCE_KM = 6;

function formatElapsedTime(
  startedAt: string | null,
  finishedAt: string | null,
  nowMs: number,
): string {
  if (!startedAt) return "00:00";

  const startMs = Date.parse(startedAt);
  if (Number.isNaN(startMs)) return "00:00";

  const endMs = finishedAt ? Date.parse(finishedAt) : nowMs;
  const totalSeconds = Math.max(0, Math.floor((endMs - startMs) / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) => String(value).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

function formatDistanceMeters(meters: number | null): string {
  if (meters === null) return "—";
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2).replace(".", ",")} km`;
  }
  return `${Math.round(meters)} m`;
}

export function RacePanel({
  session,
  progress,
  nextCheckpoint,
  checkpoints,
  onManualUnlock,
  wakeLockActive = false,
}: RacePanelProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  const isTimerRunning = Boolean(progress.startedAt && !progress.finishedAt);

  useEffect(() => {
    if (!isTimerRunning) return;

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning]);

  const isGuide = session.role === "guide";
  const completedCount = progress.completedCheckpointIds.length;
  const totalCheckpoints = checkpoints.length;
  const clampedKm = Math.min(
    TOTAL_DISTANCE_KM,
    Math.max(0, progress.currentKilometer),
  );
  const progressPercent = Math.round((clampedKm / TOTAL_DISTANCE_KM) * 100);

  return (
    <section
      aria-label="Panel de carrera"
      className="flex flex-col gap-3.5 rounded-t-3xl border-t-2 border-neutral-200 bg-white px-4 pt-4 pb-5 text-neutral-950 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
    >
      {/* Header: Dorsal + Role + Wake Lock indicator */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 rounded-xl bg-neutral-950 px-2.5 py-1 font-mono text-sm font-extrabold text-white">
            {session.dorsalNumber}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold leading-tight text-neutral-950">
              {session.displayName}
            </p>
            <p className="text-xs font-semibold text-neutral-600">
              {isGuide ? "Guía Km 0 · GPS activo" : "Pelotón · En vivo"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isGuide && wakeLockActive && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
              Pantalla fija
            </span>
          )}
          <span className="rounded-full bg-rose-100 px-2.5 py-1 font-mono text-xs font-bold text-rose-800 tabular-nums">
            CP {completedCount}/{totalCheckpoints}
          </span>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            Tiempo
          </p>
          <p className="mt-0.5 font-mono text-lg font-extrabold text-neutral-950 tabular-nums">
            {formatElapsedTime(progress.startedAt, progress.finishedAt, nowMs)}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            Distancia
          </p>
          <p className="mt-0.5 font-mono text-lg font-extrabold text-rose-700 tabular-nums">
            {clampedKm.toFixed(1).replace(".", ",")}
            <span className="text-xs font-bold text-neutral-500"> / 6 km</span>
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            Siguiente
          </p>
          <p className="mt-0.5 font-mono text-lg font-extrabold text-neutral-950 tabular-nums">
            {formatDistanceMeters(progress.distanceToNextMeters)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label="Progreso del corazón"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="h-full rounded-full bg-rose-600 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Next checkpoint clue / live status */}
      {nextCheckpoint ? (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Siguiente punto · Km{" "}
                {nextCheckpoint.kilometer.toFixed(1).replace(".", ",")}
              </p>
              <p className="text-sm font-extrabold text-neutral-950">
                {nextCheckpoint.title}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium leading-snug text-neutral-800">
            {isGuide
              ? nextCheckpoint.clue
              : "La bola de nieve avanza hacia este punto. Sigue su posición en directo en el mapa."}
          </p>

          {isGuide && onManualUnlock && (
            <button
              type="button"
              onClick={() => onManualUnlock(nextCheckpoint)}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-neutral-900 bg-white px-4 text-sm font-extrabold text-neutral-950 transition active:scale-[0.99] hover:bg-neutral-100"
            >
              Ya estoy aquí (desbloquear manual)
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 text-center">
          <p className="text-sm font-extrabold text-emerald-900">
            ¡Corazón completado! Todos los checkpoints superados.
          </p>
        </div>
      )}

      {/* Snowball peloton bar */}
      <PelotonBar
        checkpoints={checkpoints}
        completedCheckpointIds={progress.completedCheckpointIds}
      />
    </section>
  );
}
