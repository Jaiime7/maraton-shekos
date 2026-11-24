import type { Checkpoint, RaceState, RouteGeometry } from "@/types/marathon";

/**
 * Placeholder coordinates around Parque del Retiro (Madrid) forming a rough
 * 6 km heart loop. Replace with real GPX/GeoJSON coordinates before the event.
 */
export const MOCK_ROUTE: RouteGeometry = {
  path: [
    { lat: 40.4153, lng: -3.6844 }, // Km 0.0 — Start (bottom tip of heart)
    { lat: 40.4182, lng: -3.6885 }, // Km 0.8
    { lat: 40.4214, lng: -3.6894 }, // Km 1.6 — Left lobe outer
    { lat: 40.4235, lng: -3.6872 }, // Km 2.4 — Left lobe top
    { lat: 40.4212, lng: -3.6844 }, // Km 3.0 — Center dip
    { lat: 40.4235, lng: -3.6816 }, // Km 3.6 — Right lobe top
    { lat: 40.4214, lng: -3.6794 }, // Km 4.4 — Right lobe outer
    { lat: 40.4182, lng: -3.6803 }, // Km 5.2
    { lat: 40.4153, lng: -3.6844 }, // Km 6.0 — Finish (closes the heart)
  ],
};

/**
 * Generic placeholder checkpoints for local development (no real spoilers).
 * 7 snowball friends + 1 digital couple challenge + Km 6 finish line.
 */
export const MOCK_CHECKPOINTS: Checkpoint[] = [
  {
    id: "cp-1",
    kilometer: 0.8,
    title: "Kilómetro 0,8 — Primer encuentro",
    clue: "Busca junto a la primera curva hacia la izquierda, alguien espera con dorsal listo.",
    coordinates: { lat: 40.4182, lng: -3.6885 },
    radiusMeters: 30,
    type: "friend",
    friendName: "Amigo 1",
    rewardOrGameTitle: "Bienvenida al pelotón",
    rewardOrGameDescription:
      "Primer refuerzo de la bola de nieve. Foto rápida de grupo y seguimos.",
  },
  {
    id: "cp-2",
    kilometer: 1.5,
    title: "Kilómetro 1,5 — Segundo refuerzo",
    clue: "Sigue el trazo subiendo por el lateral izquierdo hasta el próximo banco.",
    coordinates: { lat: 40.4214, lng: -3.6894 },
    radiusMeters: 30,
    type: "friend",
    friendName: "Amigo 2",
    rewardOrGameTitle: "Reto exprés",
    rewardOrGameDescription:
      "Entrega de detalle sorpresa antes de sumarse a correr con los novios.",
  },
  {
    id: "cp-3",
    kilometer: 2.2,
    title: "Kilómetro 2,2 — Cima izquierda",
    clue: "En lo más alto del primer lóbulo del corazón os espera la siguiente sorpresa.",
    coordinates: { lat: 40.4235, lng: -3.6872 },
    radiusMeters: 30,
    type: "friend",
    friendName: "Amigo 3",
    rewardOrGameTitle: "Pregunta relámpago",
    rewardOrGameDescription:
      "Tres preguntas sobre la pareja en 20 segundos antes de retomar el trote.",
  },
  {
    id: "cp-4",
    kilometer: 3.0,
    title: "Kilómetro 3,0 — Mitad del corazón",
    clue: "Justo en el centro donde se unen los dos lados del corazón.",
    coordinates: { lat: 40.4212, lng: -3.6844 },
    radiusMeters: 30,
    type: "digital",
    rewardOrGameTitle: "Reto digital de ecuador",
    rewardOrGameDescription:
      "Fernando y Carla deben adivinar en 15 segundos cuál fue su primera foto juntos.",
  },
  {
    id: "cp-5",
    kilometer: 3.6,
    title: "Kilómetro 3,6 — Cima derecha",
    clue: "Coronando la segunda mitad del corazón hay dos caras conocidas esperando.",
    coordinates: { lat: 40.4235, lng: -3.6816 },
    radiusMeters: 30,
    type: "friend",
    friendName: "Amigo 4",
    rewardOrGameTitle: "Avituallamiento sorpresa",
    rewardOrGameDescription:
      "Agua, ánimos y nuevo integrante en la bola de nieve.",
  },
  {
    id: "cp-6",
    kilometer: 4.4,
    title: "Kilómetro 4,4 — Recta de bajada",
    clue: "Bajando por el borde derecho del corazón, atentos a la derecha.",
    coordinates: { lat: 40.4214, lng: -3.6794 },
    radiusMeters: 30,
    type: "friend",
    friendName: "Amigo 5",
    rewardOrGameTitle: "Mini juego de equipo",
    rewardOrGameDescription:
      "Entrega de sobre cerrado y sprint suave de 50 metros todos juntos.",
  },
  {
    id: "cp-7",
    kilometer: 5.2,
    title: "Kilómetro 5,2 — Último kilómetro",
    clue: "Ya casi cerramos el corazón. Últimos refuerzos antes de encarar la meta.",
    coordinates: { lat: 40.4182, lng: -3.6803 },
    radiusMeters: 30,
    type: "friend",
    friendName: "Amigo 6",
    rewardOrGameTitle: "Último empujón",
    rewardOrGameDescription:
      "Se suma al pelotón para entrar todos juntos a la recta final.",
  },
  {
    id: "cp-8",
    kilometer: 5.6,
    title: "Kilómetro 5,6 — Recta final",
    clue: "A solo 400 metros de cerrar el corazón os espera el último fichaje del pelotón.",
    coordinates: { lat: 40.4167, lng: -3.6824 },
    radiusMeters: 30,
    type: "friend",
    friendName: "Amigo 7",
    rewardOrGameTitle: "Pelotón al 100%",
    rewardOrGameDescription:
      "Los 7 amigos ya corren junto a Fernando y Carla hacia la meta.",
  },
  {
    id: "cp-finish",
    kilometer: 6.0,
    title: "Kilómetro 6,0 — Cierre del Corazón",
    clue: "Volved al punto de salida para cerrar el corazón completo.",
    coordinates: { lat: 40.4153, lng: -3.6844 },
    radiusMeters: 35,
    type: "finish",
    rewardOrGameTitle: "Corazón completado",
    rewardOrGameDescription:
      "¡Enhorabuena Fernando y Carla! Foto final de todo el pelotón juntos.",
  },
];

export const INITIAL_MOCK_RACE_STATE: RaceState = {
  status: "not_started",
  progress: {
    currentKilometer: 0,
    completedCheckpointIds: [],
    currentLocation: MOCK_ROUTE.path[0],
    distanceToNextMeters: 800,
    startedAt: null,
    finishedAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  forcedCheckpointEvent: null,
};
