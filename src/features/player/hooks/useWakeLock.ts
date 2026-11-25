"use client";

import { useEffect, useRef, useState } from "react";

interface WakeLockState {
  isSupported: boolean;
  isActive: boolean;
}

/**
 * Keeps the screen awake during the run using the Screen Wake Lock API and
 * automatically re-acquires the lock when returning to the foreground.
 */
export function useWakeLock(enabled: boolean): WakeLockState {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const [isActive, setIsActive] = useState(false);

  const isSupported =
    typeof navigator !== "undefined" && "wakeLock" in navigator;

  useEffect(() => {
    if (!enabled || !isSupported) {
      return;
    }

    let cancelled = false;

    const releaseSentinel = async () => {
      const current = sentinelRef.current;
      sentinelRef.current = null;
      if (current && !current.released) {
        try {
          await current.release();
        } catch {
          // Ignore release errors when the browser already dropped the lock.
        }
      }
      if (!cancelled) {
        setIsActive(false);
      }
    };

    const requestWakeLock = async () => {
      if (cancelled || document.visibilityState !== "visible") return;
      if (sentinelRef.current && !sentinelRef.current.released) return;

      try {
        const sentinel = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await sentinel.release();
          return;
        }

        sentinelRef.current = sentinel;
        setIsActive(true);

        sentinel.addEventListener(
          "release",
          () => {
            if (sentinelRef.current === sentinel) {
              sentinelRef.current = null;
            }
            if (!cancelled) {
              setIsActive(false);
            }
          },
          { once: true },
        );
      } catch {
        if (!cancelled) {
          setIsActive(false);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void requestWakeLock();
      }
    };

    void requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void releaseSentinel();
    };
  }, [enabled, isSupported]);

  return {
    isSupported,
    isActive: enabled && isSupported ? isActive : false,
  };
}
