// [Dev B] Identity selector, localStorage session, race bottom sheet, and Wake Lock API.
export { PelotonBar, type PelotonBarProps } from "./components/PelotonBar";
export { RacePanel, type RacePanelProps } from "./components/RacePanel";
export { RoleSelector } from "./components/RoleSelector";
export { RunDemoView } from "./components/RunDemoView";
export { usePlayerSession } from "./hooks/usePlayerSession";
export { useWakeLock } from "./hooks/useWakeLock";
export {
  clearPlayerSession,
  createPlayerSession,
  loadPlayerSession,
  PLAYER_SESSION_STORAGE_KEY,
  savePlayerSession,
} from "./session";
