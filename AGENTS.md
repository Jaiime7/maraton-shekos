# AGENTS.md — Proyecto: Maratón Sorpresa Preboda (Fernando & Carla)

## 1. Visión General del Proyecto
Aplicación web *mobile-first* (sin descargas ni registros) diseñada para una maratón sorpresa preboda de **12 km en total**, dividida en **dos rutas simultáneas de 6 km cada una** que, al completarse, dibujan un **corazón completo** sobre el mapa real.

* **Participantes (10 personas en total):**
  * **Los novios:** Fernando (Ruta Izquierda, 6 km) y Carla (Ruta Derecha, 6 km).
  * **El pelotón (7 amigos corriendo):** Efecto "bola de nieve". Un amigo sale en el Km 0 con cada novio haciendo de guía/liebre y el resto aparece por sorpresa en distintos kilómetros para entregar regalos/hacer juegos y unirse a correr.
  * **Meta (1 amigo):** Espera solo en el Km 6 (punto de reencuentro) grabando la llegada y el cierre del corazón.
* **Uso real:** Se usará corriendo en exteriores, con una sola mano y bajo luz solar. Debe ser ultrarrápida, de alto contraste y a prueba de fallos de GPS.

---

## 2. Stack Tecnológico
* **Framework:** Next.js (App Router) + TypeScript (estricto).
* **Estilos y Animaciones:** Tailwind CSS + Framer Motion + `canvas-confetti`.
* **Mapas y Geometría:** Google Maps JavaScript API (vía `@vis.gl/react-google-maps`, estilo minimalista claro para que destaque el trazo del corazón).
* **Backend y Tiempo Real:** Supabase (PostgreSQL + Realtime para sincronizar posiciones, estado de checkpoints y efecto espejo).
* **Despliegue:** Vercel (HTTPS obligatorio para Geolocation API y Wake Lock API).

---

## 3. Reglas de Oro para el Agente (Trabajo en Equipo)
Este proyecto lo desarrollan **2 personas en paralelo durante 2 semanas** usando ramas de Git (`main` -> `dev` -> `feat/<iniciales>-<tarea>`). Para evitar conflictos de *merge*:

1. **Respeto estricto a las carpetas:** No modifiques archivos fuera del módulo asignado a la tarea actual.
2. **Contratos cerrados:** Todo el código debe respetar las interfaces definidas en `src/types/marathon.ts`. No cambies nombres de propiedades sin avisar.
3. **Dependencias:** No instales paquetes nuevos en `package.json` sin confirmación explícita.
4. **Mocks primero:** Si el backend de Supabase aún no está conectado, usa datos *mock* tipados que cumplan `src/types/marathon.ts`.

### Estructura de Carpetas y División de Dominios
* `src/types/marathon.ts` — *(Compartido - congelado tras el Día 1)* Contratos de datos.
* `src/features/map/` — **[Dev A]** Mapa, renderizado del corazón (dos mitades), GPS (`watchPosition`), fórmula de Haversine, geofencing y **Simulador GPS** para desarrollo.
* `src/features/staff/` — **[Dev A]** Panel de Director de Carrera / Staff (radar en vivo de ambos equipos, control de ritmo y desbloqueo remoto).
* `src/lib/supabase/` — **[Dev B]** Cliente de Supabase, suscripciones Realtime y queries de estado.
* `src/features/player/` — **[Dev B]** Pantalla de inicio, persistencia en `localStorage`, tarjeta inferior de carrera (cronómetro, km, pistas, barra de pelotón) y `Wake Lock API`.
* `src/features/checkpoints/` — **[Dev B]** Modales de checkpoint desbloqueado (confeti, fotos, juegos, retos digitales) y pantalla de Gran Final (Km 6).

---

## 4. Flujo de Pantallas y Requisitos Funcionales

### Pantalla 1: Selección de Identidad (`/`)
* Pregunta principal: **"¿Eres Fernando o eres Carla?"** con dos botones grandes y claros.
* Tercer botón secundario: **"Soy del pelotón (Amigo)"** para que los amigos puedan ver el mapa en vivo y seguir la carrera.
* Enlace discreto en el pie de página: **"Acceso Staff"** protegido por un PIN numérico sencillo.
* **Persistencia:** Guardar el perfil elegido y el dorsal digital asignado en `localStorage` para recuperar la sesión al instante si se cierra el navegador.

### Pantalla 2: Mapa y Misión (`/run`)
* **Mitad superior (65% de la pantalla) — El Mapa:**
  * Muestra la ubicación actual del usuario.
  * Dibuja la ruta completa de su mitad del corazón (6 km) en **línea gris discontinua** (pendiente) y pinta en **rojo/rosa intenso** el tramo ya completado.
  * El siguiente checkpoint aparece con un marcador parpadeante.
  * **Efecto Espejo (Tiempo Real):** Gracias a Supabase Realtime, en el mapa de Fernando se ve cómo se va iluminando en vivo la mitad del corazón de Carla (en un tono complementario o con su avatar avanzando), y viceversa.
* **Mitad inferior (35% de la pantalla) — Panel de Carrera:**
  * Dorsal digital, **cronómetro en vivo** y progreso (`X,X / 6,0 km` y `Checkpoint X de 6`).
  * Distancia exacta en metros hasta el siguiente checkpoint (calculada con Haversine).
  * Pista o acertijo del siguiente punto.
  * **Barra de Pelotón Desbloqueable:** Fila con los avatares/dorsales de los amigos de su ruta en blanco y negro; se iluminan a color al superar los checkpoints de tipo `friend`.
  * **Botón de respaldo:** Botón discreto **"Ya estoy aquí"** para desbloquear manualmente si el GPS falla entre edificios.

### Pantalla 3: Checkpoint Desbloqueado (Modal)
* Se dispara automáticamente al entrar en un radio de **25–35 metros** del checkpoint, al pulsar "Ya estoy aquí" o cuando el Staff lo fuerza remotamente.
* **Feedback:** Vibración del dispositivo (`navigator.vibrate([200, 100, 200])`) + explosión de confeti (`canvas-confetti`).
* **Dos tipos de checkpoint:**
  * `type: 'friend'`: Muestra foto/mensaje de sorpresa (*"Mira a tu alrededor..."*), desbloquea el avatar del amigo en la barra del pelotón y presenta el juego/regalo de ese kilómetro.
  * `type: 'digital'`: Lanza directamente un reto, pregunta sobre la pareja, audio o vídeo corto en pantalla (dirigido por el guía que ya corre con ellos).
* Botón **"Continuar carrera"** para cerrar el modal e iluminar el siguiente tramo.

### Pantalla 4: Gran Final — Cierre del Corazón (Km 6)
* Al llegar al punto de reencuentro común (Km 6):
  * El mapa hace un *zoom out* automático uniendo la ruta de Fernando y la de Carla para mostrar el **corazón completo de 12 km iluminado**.
  * Muestra tarjeta de *Finisher*: tiempo total, distancia total, mensaje de felicitación y aviso para la foto final de los 10 amigos juntos.

### Pantalla 5: Panel de Staff / Director de Carrera (`/staff`)
* Pensado para los dos amigos guía (Km 0) y los amigos que esperan en puntos intermedios o en la Meta (Km 6).
* **Radar en vivo:** Mapa mostrando los dos pines en tiempo real (Equipo Fernando y Equipo Carla), su checkpoint actual y distancia al siguiente punto.
* **Sincronización Km 5:** Indicador claro de la diferencia de tiempo/distancia entre ambos equipos para coordinar la llegada simultánea a meta.
* **Control Maestro (Salvavidas):** Botones para forzar el desbloqueo de un checkpoint, lanzar un juego o pausar/reanudar el estado de la carrera en Supabase para todos los móviles conectados.

---

## 5. Requisitos Técnicos Críticos (Pruebas de Campo)
* **Screen Wake Lock API:** Activar `navigator.wakeLock.request('screen')` durante la carrera para evitar que la pantalla se bloquee cada 30 segundos.
* **Modo Simulador GPS (Solo Desarrollo):** Incluir un panel flotante oculto (activable vía variable de entorno `NEXT_PUBLIC_DEV_MODE=true`) que permita mover la posición GPS manualmente haciendo clic en el mapa o con un *slider* de progreso, para poder probar toda la app sin salir a la calle.
* **Diseño Outdoor:** Tipografía legible, botones grandes (mínimo 48px de alto) y alto contraste para visibilidad bajo el sol.

---

## 6. Contratos de Datos Iniciales (`src/types/marathon.ts`)

```typescript
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
  kilometer: number; // 1 a 6
  title: string;
  clue: string;
  coordinates: Coordinates;
  radiusMeters: number; // Default: 30
  type: CheckpointType;
  friendName?: string;
  friendAvatarUrl?: string;
  rewardOrGameTitle: string;
  rewardOrGameDescription: string;
  mediaUrl?: string; // Foto, audio o vídeo sorpresa
}

export type RaceStatus = 'not_started' | 'running' | 'paused' | 'finished';

export interface RouteGeometry {
  side: RouteSide;
  path: Coordinates[]; // Polilínea ordenada de la mitad del corazón (6 km)
}

export interface PlayerSession {
  role: UserRole;
  side?: RouteSide;
  dorsalNumber: string;
  displayName: string;
}

export interface TeamProgress {
  side: RouteSide;
  currentKilometer: number; // 0 a 6
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
```