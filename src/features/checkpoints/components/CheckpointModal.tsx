"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Checkpoint } from "@/types/marathon";
import {
  triggerCheckpointConfetti,
  triggerCheckpointVibration,
} from "../feedback";

export interface CheckpointModalProps {
  checkpoint: Checkpoint | null;
  onContinue: () => void;
}

function renderMedia(mediaUrl: string, title: string) {
  const lower = mediaUrl.toLowerCase();

  if (/\.(mp4|webm|mov)(\?|$)/.test(lower)) {
    return (
      <video
        src={mediaUrl}
        controls
        playsInline
        className="max-h-56 w-full rounded-2xl border border-neutral-200 bg-black object-cover"
      />
    );
  }

  if (/\.(mp3|wav|ogg|m4a)(\?|$)/.test(lower)) {
    return (
      <audio src={mediaUrl} controls className="w-full" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mediaUrl}
      alt={title}
      className="max-h-56 w-full rounded-2xl border border-neutral-200 object-cover"
    />
  );
}

export function CheckpointModal({
  checkpoint,
  onContinue,
}: CheckpointModalProps) {
  useEffect(() => {
    if (!checkpoint) return;
    triggerCheckpointVibration([200, 100, 200]);
    triggerCheckpointConfetti();
  }, [checkpoint]);

  const isFriend = checkpoint?.type === "friend";

  return (
    <AnimatePresence>
      {checkpoint && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkpoint-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/75 p-4 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex max-h-[90dvh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-3xl border-2 border-rose-500 bg-white p-6 text-neutral-950 shadow-2xl"
          >
            {/* Visual pulse header (serves as iOS fallback when vibrate() is unavailable) */}
            <div className="flex items-center justify-between gap-2">
              <motion.span
                initial={{ scale: 0.85 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.5, repeat: 1 }}
                className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white"
              >
                Checkpoint desbloqueado
              </motion.span>
              <span className="font-mono text-sm font-extrabold text-rose-700 tabular-nums">
                Km {checkpoint.kilometer.toFixed(1).replace(".", ",")}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2
                id="checkpoint-modal-title"
                className="text-2xl font-extrabold leading-tight text-neutral-950"
              >
                {checkpoint.title}
              </h2>
              {isFriend && (
                <p className="text-base font-bold text-rose-600">
                  Mira a tu alrededor… ¡nuevo fichaje para la bola de nieve!
                </p>
              )}
            </div>

            {isFriend && (
              <div className="flex items-center gap-3.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-rose-600 bg-gradient-to-br from-rose-500 to-amber-500 text-lg font-extrabold text-white shadow-sm">
                  {checkpoint.friendAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={checkpoint.friendAvatarUrl}
                      alt={checkpoint.friendName ?? "Amigo del pelotón"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      {(checkpoint.friendName ?? "AM").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Se une al pelotón
                  </p>
                  <p className="truncate text-lg font-extrabold text-neutral-950">
                    {checkpoint.friendName ?? "Amigo sorpresa"}
                  </p>
                </div>
              </div>
            )}

            {checkpoint.mediaUrl &&
              renderMedia(checkpoint.mediaUrl, checkpoint.title)}

            <div className="flex flex-col gap-1.5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {isFriend ? "Juego / Sorpresa del kilómetro" : "Reto digital"}
              </p>
              <p className="text-base font-extrabold text-neutral-950">
                {checkpoint.rewardOrGameTitle}
              </p>
              <p className="text-sm font-medium leading-relaxed text-neutral-700">
                {checkpoint.rewardOrGameDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="mt-1 flex min-h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-rose-600 px-5 text-base font-extrabold text-white shadow-sm transition active:scale-[0.99] hover:bg-rose-700"
            >
              Continuar carrera
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
