import confetti from "canvas-confetti";

const HEART_COLORS = ["#e11d48", "#fb7185", "#f59e0b", "#ffffff"];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Triggers haptic feedback when supported (Android) without breaking on iOS Safari.
 */
export function triggerCheckpointVibration(pattern: number[] = [200, 100, 200]): void {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore browser blocks on vibration without user gesture.
    }
  }
}

/**
 * Fires a confetti burst for a regular checkpoint unlock.
 */
export function triggerCheckpointConfetti(): void {
  if (typeof window === "undefined" || prefersReducedMotion()) return;

  void confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: HEART_COLORS,
  });
}

/**
 * Fires a celebratory multi-burst confetti sequence for the Km 6 finish line.
 */
export function triggerFinishConfetti(): () => void {
  if (typeof window === "undefined" || prefersReducedMotion()) {
    return () => {};
  }

  const fireSide = (originX: number, angle: number) => {
    void confetti({
      particleCount: 65,
      angle,
      spread: 60,
      origin: { x: originX, y: 0.65 },
      colors: HEART_COLORS,
    });
  };

  fireSide(0.15, 60);
  fireSide(0.85, 120);

  const timeoutId = window.setTimeout(() => {
    void confetti({
      particleCount: 110,
      spread: 95,
      origin: { y: 0.55 },
      colors: HEART_COLORS,
    });
  }, 420);

  return () => window.clearTimeout(timeoutId);
}
