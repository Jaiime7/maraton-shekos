"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserRole } from "@/types/marathon";
import { usePlayerSession } from "../hooks/usePlayerSession";

const ROLE_LABELS: Record<UserRole, string> = {
  guide: "Guía Km 0 (Emite GPS)",
  friend: "Pelotón (En vivo)",
  staff: "Staff",
};

export function RoleSelector() {
  const router = useRouter();
  const { session, selectRole, resetSession } = usePlayerSession();
  const [friendName, setFriendName] = useState("");
  const [showFriendForm, setShowFriendForm] = useState(false);

  const handleSelectGuide = () => {
    selectRole("guide");
    router.push("/run");
  };

  const handleConfirmFriend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    selectRole("friend", friendName);
    router.push("/run");
  };

  const handleContinueSession = () => {
    if (!session) return;
    router.push(session.role === "staff" ? "/staff" : "/run");
  };

  return (
    <main className="flex min-h-dvh flex-col justify-between bg-neutral-50 px-5 py-8 text-neutral-950">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-auto my-auto flex w-full max-w-md flex-col gap-6"
      >
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700">
            6 km · Ruta Corazón
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950">
            Fernando &amp; Carla
          </h1>
          <p className="max-w-xs text-base font-medium text-neutral-600">
            Maratón sorpresa preboda. Elige cómo participas en la bola de nieve.
          </p>
        </header>

        {session ? (
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-neutral-900 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Sesión recuperada
                </p>
                <p className="text-lg font-extrabold text-neutral-950">
                  {session.displayName}
                </p>
                <p className="text-sm font-medium text-neutral-600">
                  {ROLE_LABELS[session.role]}
                </p>
              </div>
              <span className="rounded-xl bg-neutral-950 px-3 py-1.5 font-mono text-base font-bold text-white">
                {session.dorsalNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={handleContinueSession}
              className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-rose-600 px-5 text-base font-bold text-white transition active:scale-[0.99] hover:bg-rose-700"
            >
              Continuar carrera
            </button>

            <button
              type="button"
              onClick={resetSession}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-200"
            >
              Cambiar de rol
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <button
              type="button"
              onClick={handleSelectGuide}
              className="flex min-h-16 w-full cursor-pointer flex-col items-start justify-center rounded-2xl bg-rose-600 px-5 py-4 text-left text-white shadow-sm transition active:scale-[0.99] hover:bg-rose-700"
            >
              <span className="text-lg font-extrabold leading-tight">
                Soy el Guía (Iniciar / Llevar carrera)
              </span>
              <span className="mt-1 text-sm font-medium text-rose-100">
                Emite GPS en directo y activa los checkpoints y sorpresas
              </span>
            </button>

            {!showFriendForm ? (
              <button
                type="button"
                onClick={() => setShowFriendForm(true)}
                className="flex min-h-16 w-full cursor-pointer flex-col items-start justify-center rounded-2xl border-2 border-neutral-900 bg-white px-5 py-4 text-left text-neutral-950 shadow-sm transition active:scale-[0.99] hover:bg-neutral-100"
              >
                <span className="text-lg font-extrabold leading-tight">
                  Soy del Pelotón (Ver en vivo)
                </span>
                <span className="mt-1 text-sm font-medium text-neutral-600">
                  Modo espectador · Sigue dónde viene la bola de nieve
                </span>
              </button>
            ) : (
              <form
                onSubmit={handleConfirmFriend}
                className="flex flex-col gap-3 rounded-2xl border-2 border-neutral-900 bg-white p-5 shadow-sm"
              >
                <label
                  htmlFor="friend-name"
                  className="text-sm font-bold text-neutral-900"
                >
                  Tu nombre para el dorsal (opcional)
                </label>
                <input
                  id="friend-name"
                  type="text"
                  maxLength={24}
                  value={friendName}
                  onChange={(event) => setFriendName(event.target.value)}
                  placeholder="Ej. Jaime"
                  className="min-h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 text-base font-medium text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none"
                />
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowFriendForm(false)}
                    className="flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-200"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex min-h-12 flex-[2] cursor-pointer items-center justify-center rounded-xl bg-neutral-950 px-4 text-base font-bold text-white hover:bg-neutral-800"
                  >
                    Ver carrera en vivo
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </motion.section>

      <footer className="mx-auto mt-8 flex w-full max-w-md justify-center pt-4">
        <Link
          href="/staff"
          className="inline-flex min-h-12 items-center px-4 text-sm font-semibold text-neutral-500 underline underline-offset-4 transition hover:text-neutral-900"
        >
          Acceso Staff
        </Link>
      </footer>
    </main>
  );
}
