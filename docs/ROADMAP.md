# ROADMAP — Maratón Sorpresa (2 Semanas)

> **Regla anti-conflictos:** Anthony actualiza solo la sección **Dev A** y Jaime solo la sección **Dev B**. Hacer `git pull origin dev` antes de abrir rama nueva.

---

## Fase 0 — Base Común (Día 1)
- [x] Definir arquitectura y contratos en `AGENTS.md`
- [x] Inicializar Next.js + TypeScript estricto + Tailwind + dependencias base
- [x] Congelar `src/types/marathon.ts` y estructura de carpetas
- [x] Configurar `.env.example` y rutas base (`/`, `/run`, `/staff`)
- [ ] Primer commit en `main`, crear rama `dev` y subir al remoto

---

## Dev A — Anthony (`src/features/map/`, `src/features/staff/`)

### Semana 1 — Mapa, Corazón y Simulador GPS
- [ ] Configurar Google Maps (`@vis.gl/react-google-maps`) con estilo claro minimalista
- [ ] Cargar y renderizar las dos mitades del corazón (`RouteGeometry` mock/real): tramo pendiente en gris discontinuo y completado en rojo/rosa
- [ ] Implementar cálculo de distancia con Haversine y geofencing (radio 25–35 m)
- [ ] Implementar hook de GPS (`watchPosition`) con reconexión al volver a primer plano (`visibilitychange`)
- [ ] Construir **Simulador GPS** activable con `NEXT_PUBLIC_DEV_MODE=true` (clic en mapa + slider de progreso)
- [ ] Renderizar efecto espejo (progreso del otro equipo en tiempo real) y marcador parpadeante del siguiente checkpoint

### Semana 2 — Panel de Staff y Cierre del Corazón
- [ ] Construir pantalla `/staff` con radar en vivo de ambos equipos (Fernando y Carla)
- [ ] Añadir indicador de sincronización Km 5 (diferencia de distancia/tiempo entre equipos)
- [ ] Conectar Control Maestro: forzar desbloqueo de checkpoint, pausar/reanudar carrera
- [ ] Implementar animación de *zoom out* en Km 6 mostrando el corazón completo de 12 km

---

## Dev B — Jaime (`src/lib/supabase/`, `src/features/player/`, `src/features/checkpoints/`)

### Semana 1 — Sesión, Panel de Carrera y Modales (con Mocks)
- [ ] Crear datos mock tipados (`checkpoints` de Fernando y Carla + `RaceState` inicial)
- [ ] Implementar persistencia de `PlayerSession` en `localStorage`
- [ ] Construir Pantalla 1 (`/`) de selección de identidad (Fernando, Carla, Pelotón, Acceso Staff con PIN)
- [ ] Implementar hook de `Wake Lock API` con recuperación automática en `visibilitychange`
- [ ] Construir tarjeta inferior de `/run` (35% pantalla): dorsal, cronómetro, km, distancia al siguiente checkpoint, pista, barra de pelotón (B/N → color) y botón *"Ya estoy aquí"*
- [ ] Construir Modal de Checkpoint Desbloqueado (`friend` y `digital`) con `canvas-confetti` y vibración (con fallback visual/sonoro para iOS)
- [ ] Construir tarjeta/pantalla de Gran Final (Km 6 — *Finisher*)

### Semana 2 — Supabase, Realtime y Seguridad Staff
- [ ] Diseñar y crear tablas en Supabase + habilitar Realtime (documentar esquema en `docs/SYNC.md`)
- [ ] Implementar cliente y suscripciones Realtime en `src/lib/supabase/` reemplazando los mocks
- [ ] Proteger acciones de `/staff` validando `STAFF_PIN` en servidor (Route Handler / Server Action)
- [ ] Garantizar regla de escritura: solo el perfil activo de equipo (`fernando` / `carla`) emite ubicación; `friend` es solo lectura

---

## Integración y Prueba de Campo (Últimos 3 días)
- [ ] Integrar `<HeartMap />` (Dev A) + `<RacePanel />` y `<CheckpointModal />` (Dev B) en `src/app/run/page.tsx`
- [ ] Cargar coordenadas reales (GPX/GeoJSON) y contenido definitivo (fotos, pistas, retos)
- [ ] Desplegar en Vercel (HTTPS) con restricciones de API Key y cuotas en Google Cloud
- [ ] **Prueba real en exteriores** con iOS y Android (GPS, Wake Lock, efecto espejo y Control Maestro)
