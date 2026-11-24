# AGENTS.md — Proyecto: Maratón Sorpresa Preboda (Fernando & Carla)

## 1. Visión General del Proyecto
Aplicación web *mobile-first* (sin descargas ni registros) diseñada para una maratón sorpresa preboda de **6 km en ruta única**, donde todos corren juntos dibujando un **corazón completo** sobre el mapa real.

* **Participantes y dinámica "bola de nieve":**
  * **Los novios:** Fernando y Carla corren juntos toda la ruta de 6 km.
  * **El guía del Km 0:** Sale desde el principio con los novios y **lleva la app principal abierta** (emite la ubicación GPS del pelotón, dispara los checkpoints/juegos y enseña las sorpresas a los novios).
  * **El pelotón (7 amigos acompañando en bola de nieve):** El resto de amigos espera escondido en distintos kilómetros para sorprender a los novios, entregar regalos/hacer juegos y unirse a correr. Mientras esperan, ven **en vivo en el mapa** por dónde viene la bola de nieve.
  * **Meta (Km 6):** Punto de llegada y cierre del corazón, con foto final de todos juntos.
* **Uso real:** Se usará corriendo en exteriores, con una sola mano y bajo luz solar. Debe ser ultrarrápida, de alto contraste y a prueba de fallos de GPS.

---

## 2. Stack Tecnológico
* **Framework:** Next.js (App Router) + TypeScript (estricto).
* **Estilos y Animaciones:** Tailwind CSS + Framer Motion + `canvas-confetti`.
* **Mapas y Geometría:** Google Maps JavaScript API (vía `@vis.gl/react-google-maps`, estilo minimalista claro para que destaque el trazo del corazón).
* **Backend y Tiempo Real:** Supabase (PostgreSQL + Realtime para transmitir en vivo la posición de la bola de nieve y el estado de los checkpoints a todos los amigos conectados).
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
* `src/features/map/` — **[Dev A]** Mapa del corazón (6 km), GPS del guía (`watchPosition`), fórmula de Haversine, geofencing y **Simulador GPS** para desarrollo.
* `src/features/staff/` — **[Dev A]** Panel de Staff / Control Maestro (radar en vivo de la bola de nieve, desbloqueo remoto de checkpoints y control de estado de carrera).
* `src/lib/supabase/` — **[Dev B]** Cliente de Supabase, suscripciones Realtime y queries de estado.
* `src/features/player/` — **[Dev B]** Pantalla de inicio, persistencia en `localStorage`, tarjeta inferior de carrera (cronómetro, km, pistas, barra de pelotón bola de nieve) y `Wake Lock API`.
* `src/features/checkpoints/` — **[Dev B]** Modales de checkpoint desbloqueado (confeti, fotos, juegos, retos digitales) y pantalla de Gran Final (Km 6).

---

## 4. Flujo de Pantallas y Requisitos Funcionales

### Pantalla 1: Selección de Rol (`/`)
* Botón principal (Guía Km 0): **"Soy el Guía (Iniciar / Llevar carrera)"** — único rol que emite GPS y controla el avance en directo.
* Botón secundario (Amigos): **"Soy del Pelotón (Ver en vivo)"** — modo espectador en tiempo real (solo lectura) para ver dónde viene la bola de nieve.
* Enlace discreto en el pie de página: **"Acceso Staff"** protegido por un PIN numérico sencillo.
* **Persistencia:** Guardar el perfil elegido y el dorsal digital asignado en `localStorage` para recuperar la sesión al instante si se cierra el navegador.

### Pantalla 2: Mapa y Misión (`/run`)
* **Mitad superior (65% de la pantalla) — El Mapa:**
  * Dibuja la ruta completa del corazón (6 km) en **línea gris discontinua** (pendiente) y pinta en **rojo/rosa intenso** el tramo ya completado.
  * Muestra el pin en vivo de la **bola de nieve** avanzando (emitido por el Guía y visto en tiempo real por todos los amigos vía Supabase Realtime).
  * El siguiente checkpoint aparece con un marcador parpadeante.
* **Mitad inferior (35% de la pantalla) — Panel de Carrera:**
  * Dorsal digital, **cronómetro en vivo** y progreso (`X,X / 6,0 km` y `Checkpoint X de N`).
  * Distancia exacta en metros hasta el siguiente checkpoint (calculada con Haversine).
  * Pista o acertijo del siguiente punto (visible para el Guía; los amigos en modo espectador ven el estado y la distancia en vivo).
  * **Barra de Pelotón (Bola de Nieve):** Fila con los avatares/dorsales de los 7 amigos en blanco y negro; se iluminan a color a medida que se superan los checkpoints de tipo `friend`.
  * **Botón de respaldo (solo Guía):** Botón discreto **"Ya estoy aquí"** para desbloquear manualmente si el GPS falla entre edificios.

### Pantalla 3: Checkpoint Desbloqueado (Modal)
* Se dispara automáticamente al entrar el Guía en un radio de **25–35 metros** del checkpoint, al pulsar "Ya estoy aquí" o cuando el Staff lo fuerza remotamente.
* **Feedback:** Vibración del dispositivo (`navigator.vibrate([200, 100, 200])`, con fallback visual/animación para iOS Safari) + explosión de confeti (`canvas-confetti`).
* **Dos tipos de checkpoint:**
  * `type: 'friend'`: Muestra foto/mensaje de sorpresa (*"Mira a tu alrededor..."*), desbloquea el avatar del amigo en la barra del pelotón y presenta el juego/regalo de ese kilómetro.
  * `type: 'digital'`: Lanza directamente un reto, pregunta sobre la pareja, audio o vídeo corto en pantalla (dirigido por el Guía para los novios).
* Botón **"Continuar carrera"** para cerrar el modal e iluminar el siguiente tramo.

### Pantalla 4: Gran Final — Cierre del Corazón (Km 6)
* Al llegar al Km 6 (cierre del corazón):
  * El mapa hace un *zoom out* automático mostrando el **corazón completo de 6 km iluminado**.
  * Muestra tarjeta de *Finisher*: tiempo total, distancia total (6,0 km), barra del pelotón al 100%, mensaje de felicitación para Fernando & Carla y aviso para la foto final juntos.

### Pantalla 5: Panel de Staff / Control Maestro (`/staff`)
* Salvavidas operativo (protegido por PIN en servidor) por si falla el móvil del Guía o hay que intervenir en directo.
* **Radar en vivo:** Mapa mostrando la ubicación actual de la bola de nieve, checkpoint actual y distancia al siguiente punto.
* **Control Maestro:** Botones para iniciar/pausar/reanudar la carrera, forzar el desbloqueo de un checkpoint o reiniciar estado en Supabase para todos los móviles conectados.

---

## 5. Requisitos Técnicos Críticos (Pruebas de Campo)
* **Screen Wake Lock API:** Activar `navigator.wakeLock.request('screen')` durante la carrera (y re-adquirirlo en `visibilitychange`) para evitar que la pantalla del Guía se bloquee cada 30 segundos.
* **Regla de Escritura GPS:** Solo el rol `guide` emite `currentLocation` a Supabase. El rol `friend` es estrictamente **solo lectura**.
* **Modo Simulador GPS (Solo Desarrollo):** Panel flotante oculto (activable vía `NEXT_PUBLIC_DEV_MODE=true`) que permite mover la posición GPS manualmente haciendo clic en el mapa o con un *slider* de progreso para probar toda la app sin salir a la calle.
* **Diseño Outdoor:** Tipografía legible, botones grandes (mínimo 48px de alto) y alto contraste para visibilidad bajo el sol.

---

## 6. Contratos de Datos Iniciales (`src/types/marathon.ts`)

```typescript
export type UserRole = 'guide' | 'friend' | 'staff';
export type CheckpointType = 'friend' | 'digital' | 'finish';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Checkpoint {
  id: string;
  kilometer: number; // 1 a 6 (permite decimales, ej. 1.5)
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
  path: Coordinates[]; // Polilínea ordenada del corazón completo (6 km)
}

export interface PlayerSession {
  role: UserRole;
  dorsalNumber: string;
  displayName: string;
}

export interface RaceProgress {
  currentKilometer: number; // 0 a 6
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
```
