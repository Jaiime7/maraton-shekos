"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Checkpoint, RaceProgress } from "@/types/marathon";
import {
  triggerCheckpointVibration,
  triggerFinishConfetti,
} from "../feedback";

export interface FinisherCardProps {
  progress: RaceProgress;
  checkpoints: Checkpoint[];
  onViewMap?: () => void;
}

function formatTotalDuration(
  startedAt: string | null,
  finishedAt: string | null,
): string {
  if (!startedAt || !finishedAt) return "—";
  const startMs = Date.parse(startedAt);
  const endMs = Date.parse(finishedAt);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return "—";

  const totalSeconds = Math.max(0, Math.floor((endMs - startMs) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

export function FinisherCard({
  progress,
  checkpoints,
  onViewMap,
}: FinisherCardProps) {
  useEffect(() => {
    triggerCheckpointVibration([250, 100, 250, 100, 400]);
    return triggerFinishConfetti();
  }, []);

  const friendCheckpoints = checkpoints.filter((cp) => cp.type === "friend");
  const completedSet = new Set(progress.completedCheckpointIds);
  const unlockedFriends = friendCheckpoints.filter((cp) =>
    completedSet.has(cp.id),
  ).length;
  const pelotonPercent =
    friendCheckpoints.length > 0
      ? Math.round((unlockedFriends / friendCheckpoints.length) * 100)
      : 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="finisher-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/75 p-4 backdrop-blur-sm sm:items-center"
    >
      <motion.section
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="flex max-h-[92dvh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-3xl border-2 border-rose-500 bg-white p-6 text-center text-neutral-950 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-rose-600 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-white">
            Finisher · Corazón Completado
          </span>
          <h2
            id="finisher-title"
            className="text-3xl font-extrabold tracking-tight text-neutral-950"
          >
            ¡Fernando &amp; Carla!
          </h2>
          <p className="text-sm font-medium text-neutral-600">
            Habéis cerrado el corazón completo de 6 km rodeados de todo el
            pelotón.
          </p>
        </div>

        {/* Finisher metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-2.5 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              Tiempo
            </p>
            <p className="mt-1 font-mono text-lg font-extrabold text-neutral-950 tabular-nums">
              {formatTotalDuration(progress.startedAt, progress.finishedAt)}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-2.5 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              Distancia
            </p>
            <p className="mt-1 font-mono text-lg font-extrabold text-rose-700 tabular-nums">
              6,0 km
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-2.5 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              Pelotón
            </p>
            <p className="mt-1 font-mono text-lg font-extrabold text-emerald-700 tabular-nums">
              {pelotonPercent}%
            </p>
          </div>
        </div>

        {/* Final group photo callout */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
          <p className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
            Última misión en meta
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-amber-950">
            Reuníos todos juntos en el punto de llegada para la foto final del
            equipo completo.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {onViewMap && (
            <button
              type="button"
              onClick={onViewMap}
              className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-rose-600 px-5 text-base font-extrabold text-white shadow-sm transition active:scale-[0.99] hover:bg-rose-700"
            >
              Ver corazón completo en el mapa
            </button>
          )}
          <Link
            href="/"
            className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-neutral-300 bg-neutral-100 px-5 text-sm font-bold text-neutral-800 hover:bg-neutral-200"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
