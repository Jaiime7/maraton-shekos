export type UserRole = 'guide' | 'friend' | 'staff';
export type CheckpointType = 'friend' | 'digital' | 'finish';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Checkpoint {
  id: string;
  kilometer: number; // 1 to 6 (supports decimals, e.g. 1.5)
  title: string;
  clue: string;
  coordinates: Coordinates;
  radiusMeters: number; // Default: 30
  type: CheckpointType;
  friendName?: string;
  friendAvatarUrl?: string;
  rewardOrGameTitle: string;
  rewardOrGameDescription: string;
  mediaUrl?: string; // Photo, audio, or surprise video
}

export type RaceStatus = 'not_started' | 'running' | 'paused' | 'finished';

export interface RouteGeometry {
  path: Coordinates[]; // Ordered polyline of the complete 6 km heart
}

export interface PlayerSession {
  role: UserRole;
  dorsalNumber: string;
  displayName: string;
}

export interface RaceProgress {
  currentKilometer: number; // 0 to 6
  completedCheckpointIds: string[];
  currentLocation: Coordinates | null;
  distanceToNextMeters: number | null;
  startedAt: string | null; // ISO timestamp
  finishedAt: string | null; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ForcedCheckpointEvent {
  checkpointId: string;
  triggeredAt: string; // ISO timestamp
}

export interface RaceState {
  status: RaceStatus;
  progress: RaceProgress;
  forcedCheckpointEvent?: ForcedCheckpointEvent | null;
}
