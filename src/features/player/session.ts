import type { PlayerSession, UserRole } from "@/types/marathon";

export const PLAYER_SESSION_STORAGE_KEY = "maraton_shekos_session_v1";
const SESSION_CHANGE_EVENT = "maraton-shekos:session-change";

const VALID_ROLES: ReadonlySet<UserRole> = new Set(["guide", "friend", "staff"]);

function isValidSession(value: unknown): value is PlayerSession {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.role === "string" &&
    VALID_ROLES.has(record.role as UserRole) &&
    typeof record.dorsalNumber === "string" &&
    record.dorsalNumber.trim().length > 0 &&
    typeof record.displayName === "string" &&
    record.displayName.trim().length > 0
  );
}

export function loadPlayerSession(): PlayerSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(PLAYER_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePlayerSession(session: PlayerSession): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    PLAYER_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function clearPlayerSession(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(PLAYER_SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function subscribePlayerSession(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PLAYER_SESSION_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SESSION_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SESSION_CHANGE_EVENT, onStoreChange);
  };
}

export function createPlayerSession(
  role: UserRole,
  customName?: string,
): PlayerSession {
  const trimmedName = customName?.trim();

  if (role === "guide") {
    return {
      role: "guide",
      dorsalNumber: "#00",
      displayName: trimmedName || "Guía Km 0",
    };
  }

  if (role === "staff") {
    return {
      role: "staff",
      dorsalNumber: "#ST",
      displayName: trimmedName || "Staff",
    };
  }

  const randomDorsal = String(Math.floor(Math.random() * 7) + 1).padStart(
    2,
    "0",
  );

  return {
    role: "friend",
    dorsalNumber: `#${randomDorsal}`,
    displayName: trimmedName || "Pelotón",
  };
}
