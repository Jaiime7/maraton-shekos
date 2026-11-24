"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { PlayerSession, UserRole } from "@/types/marathon";
import {
  clearPlayerSession,
  createPlayerSession,
  loadPlayerSession,
  PLAYER_SESSION_STORAGE_KEY,
  savePlayerSession,
  subscribePlayerSession,
} from "../session";

let cachedRaw: string | null | undefined;
let cachedSession: PlayerSession | null = null;

function getClientSnapshot(): PlayerSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(PLAYER_SESSION_STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedSession;
  }

  cachedRaw = raw;
  cachedSession = loadPlayerSession();
  return cachedSession;
}

function getServerSnapshot(): PlayerSession | null {
  return null;
}

export function usePlayerSession() {
  const session = useSyncExternalStore(
    subscribePlayerSession,
    getClientSnapshot,
    getServerSnapshot,
  );

  const selectRole = useCallback((role: UserRole, customName?: string) => {
    const nextSession = createPlayerSession(role, customName);
    savePlayerSession(nextSession);
    return nextSession;
  }, []);

  const resetSession = useCallback(() => {
    clearPlayerSession();
  }, []);

  return {
    session,
    selectRole,
    resetSession,
  };
}
