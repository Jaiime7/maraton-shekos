"use client";

import { motion } from "framer-motion";
import type { Checkpoint } from "@/types/marathon";

export interface PelotonBarProps {
  checkpoints: Checkpoint[];
  completedCheckpointIds: string[];
}

function getInitials(name: string, index: number): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `A${index + 1}`;
}

export function PelotonBar({
  checkpoints,
  completedCheckpointIds,
}: PelotonBarProps) {
  const friendCheckpoints = checkpoints.filter((cp) => cp.type === "friend");
  const completedSet = new Set(completedCheckpointIds);
  const unlockedCount = friendCheckpoints.filter((cp) =>
    completedSet.has(cp.id),
  ).length;

  return (
    <section aria-label="Barra de pelotón" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
          Pelotón (Bola de nieve)
        </span>
        <span className="font-mono text-xs font-bold text-rose-700 tabular-nums">
          {unlockedCount} / {friendCheckpoints.length} unidos
        </span>
      </div>

      <ul className="grid grid-cols-7 gap-1.5">
        {friendCheckpoints.map((checkpoint, index) => {
          const isUnlocked = completedSet.has(checkpoint.id);
          const label = checkpoint.friendName ?? `Amigo ${index + 1}`;
          const initials = getInitials(label, index);

          return (
            <li key={checkpoint.id} className="flex flex-col items-center gap-1">
              <motion.div
                initial={false}
                animate={
                  isUnlocked
                    ? { scale: [1, 1.15, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.35 }}
                title={`${label} (Km ${checkpoint.kilometer.toFixed(1).replace(".", ",")})`}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-all ${
                  isUnlocked
                    ? "border-rose-600 bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-sm"
                    : "border-dashed border-neutral-300 bg-neutral-100 text-neutral-400 grayscale opacity-60"
                }`}
              >
                {checkpoint.friendAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={checkpoint.friendAvatarUrl}
                    alt={label}
                    className={`h-full w-full rounded-full object-cover ${
                      isUnlocked ? "" : "grayscale"
                    }`}
                  />
                ) : (
                  <span>{initials}</span>
                )}
                {isUnlocked && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white ring-2 ring-white"
                  >
                    ✓
                  </span>
                )}
              </motion.div>
              <span
                className={`max-w-full truncate text-[10px] font-semibold ${
                  isUnlocked ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
