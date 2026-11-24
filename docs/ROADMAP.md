# ROADMAP — Maratón Sorpresa 6 km Corazón (2 Semanas)

> **Regla anti-conflictos:** Anthony actualiza solo la sección **Dev A** y Jaime solo la sección **Dev B**. Hacer `git pull origin dev` antes de abrir rama nueva.

---

## Fase 0 — Base Común (Día 1)
- [x] Definir arquitectura y contratos en `AGENTS.md` (ruta única de 6 km en corazón + bola de nieve)
- [x] Inicializar Next.js + TypeScript estricto + Tailwind + dependencias base
- [x] Congelar `src/types/marathon.ts` y estructura de carpetas
- [x] Configurar `.env.example` y rutas base (`/`, `/run`, `/staff`)
- [x] Subir `main` y `dev` al repositorio remoto

---

## Dev A — Anthony (`src/features/map/`, `src/features/staff/`)

### Semana 1 — Mapa del Corazón y Simulador GPS
- [ ] Configurar Google Maps (`@vis.gl/react-google-maps`) con estilo claro minimalista
- [ ] Cargar y renderizar la ruta única del corazón (6 km, `RouteGeometry`): tramo pendiente en gris discontinuo y completado en rojo/rosa
- [ ] Implementar cálculo de distancia con Haversine y geofencing (radio 25–35 m)
- [ ] Implementar hook de GPS (`watchPosition`) activo solo para el rol `guide`, con reconexión en `visibilitychange`
- [ ] Construir **Simulador GPS** activable con `NEXT_PUBLIC_DEV_MODE=true` (clic en mapa + slider de progreso)
- [ ] Mostrar pin en vivo de la bola de nieve y marcador parpadeante del siguiente checkpoint

### Semana 2 — Panel de Staff y Cierre del Corazón
- [ ] Construir pantalla `/staff` con radar en vivo de la bola de nieve y distancia al siguiente checkpoint
- [ ] Conectar Control Maestro: iniciar/pausar/reanudar carrera y forzar desbloqueo de checkpoint
- [ ] Implementar animación de *zoom out* en Km 6 mostrando el corazón completo de 6 km iluminado

---

## Dev B — Jaime (`src/lib/supabase/`, `src/features/player/`, `src/features/checkpoints/`)

### Semana 1 — Sesión, Panel de Carrera y Modales (con Mocks)
- [x] Crear datos mock tipados (checkpoints de los 7 amigos en bola de nieve + retos + `RaceState` inicial)
- [x] Implementar persistencia de `PlayerSession` en `localStorage`
- [x] Construir Pantalla 1 (`/`) de selección de rol: **Guía Km 0**, **Pelotón (Ver en vivo)** y **Acceso Staff**
- [ ] Implementar hook de `Wake Lock API` con recuperación automática en `visibilitychange`
- [ ] Construir tarjeta inferior de `/run` (35% pantalla): dorsal, cronómetro, progreso (`X,X / 6,0 km`), distancia al siguiente checkpoint, pista, barra de pelotón (7 amigos B/N → color) y botón *"Ya estoy aquí"* (solo Guía)
- [ ] Construir Modal de Checkpoint Desbloqueado (`friend` y `digital`) con `canvas-confetti` y vibración (con fallback visual para iOS)
- [ ] Construir tarjeta/pantalla de Gran Final (Km 6 — *Finisher*)

### Semana 2 — Supabase, Realtime y Seguridad Staff
- [ ] Diseñar y crear tablas en Supabase + habilitar Realtime (documentar esquema en `docs/SYNC.md`)
- [ ] Implementar cliente y suscripciones Realtime en `src/lib/supabase/` reemplazando los mocks
- [ ] Proteger acciones de `/staff` validando `STAFF_PIN` en servidor (Route Handler / Server Action)
- [ ] Garantizar regla de escritura: solo `guide` emite ubicación GPS; `friend` es solo lectura

---

## Integración y Prueba de Campo (Últimos 3 días)
- [ ] Integrar `<HeartMap />` (Dev A) + `<RacePanel />` y `<CheckpointModal />` (Dev B) en `src/app/run/page.tsx`
- [ ] Cargar coordenadas reales del corazón (6 km) y contenido definitivo (fotos, pistas, juegos)
- [ ] Desplegar en Vercel (HTTPS) con restricciones de API Key y cuotas en Google Cloud
- [ ] **Prueba real en exteriores** con iOS y Android (Guía emitiendo GPS + amigos viendo la bola de nieve en vivo + Wake Lock + Control Maestro)
