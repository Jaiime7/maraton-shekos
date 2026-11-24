export type RouteSide = 'fernando' | 'carla';
export type UserRole = 'fernando' | 'carla' | 'friend' | 'staff';
export type CheckpointType = 'friend' | 'digital' | 'finish';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Checkpoint {
  id: string;
  side: RouteSide | 'shared';
  kilometer: number; // 1 to 6
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
  side: RouteSide;
  path: Coordinates[]; // Ordered polyline for one half of the heart (6 km)
}

export interface PlayerSession {
  role: UserRole;
  side?: RouteSide;
  dorsalNumber: string;
  displayName: string;
}

export interface TeamProgress {
  side: RouteSide;
  currentKilometer: number; // 0 to 6
  completedCheckpointIds: string[];
  currentLocation: Coordinates | null;
  distanceToNextMeters: number | null;
  startedAt: string | null; // ISO timestamp
  finishedAt: string | null; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ForcedCheckpointEvent {
  side: RouteSide;
  checkpointId: string;
  triggeredAt: string; // ISO timestamp
}

export interface RaceState {
  status: RaceStatus;
  fernando: TeamProgress;
  carla: TeamProgress;
  forcedCheckpointEvent?: ForcedCheckpointEvent | null;
}
