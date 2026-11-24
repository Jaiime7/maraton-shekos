# SYNC — Acuerdos Técnicos y Puntos de Integración

> Leer este archivo al iniciar cada sesión. Aquí solo van **decisiones técnicas compartidas**, **contratos entre módulos** y **avisos entre Dev A (Anthony) y Dev B (Jaime)**.

---

## 1. Flujo de Git
- **Ramas:** `main` (estable) → `dev` (integración) → `feat/an-<tarea>` (Anthony) / `feat/js-<tarea>` (Jaime).
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- **Carpetas:**
  - Anthony: `src/features/map/`, `src/features/staff/`, `src/app/staff/`
  - Jaime: `src/lib/supabase/`, `src/features/player/`, `src/features/checkpoints/`, `src/app/page.tsx`
  - **Punto de encuentro compartido:** `src/app/run/page.tsx` (mantenerlo fino: solo conecta componentes de ambos).

---

## 2. Decisiones Técnicas Cerradas
- **Dinámica de carrera:** Ruta única de **6 km en forma de corazón**. Fernando y Carla corren juntos acompañados por **7 amigos en estilo bola de nieve**.
- **Quién lleva la app:** El **Guía del Km 0** (`role: 'guide'`) es el único que emite ubicación GPS y desbloquea checkpoints. Los amigos (`role: 'friend'`) abren la app en **solo lectura** para seguir en vivo por dónde viene la bola de nieve.
- **Motor de mapa:** Google Maps JavaScript API vía `@vis.gl/react-google-maps`. No desmontar `<Map>` al actualizar coordenadas GPS (evita consumir cargas extra de cuota).
- **Compatibilidad iOS Safari:**
  - `navigator.vibrate()` no existe en iOS → acompañarlo siempre de feedback visual/animación.
  - Al volver a la pestaña tras bloquear o usar la cámara (`visibilitychange`), re-solicitar `Wake Lock` y re-sincronizar estado.
- **Seguridad `/staff`:** Validar `STAFF_PIN` en servidor (Route Handler / Server Action), nunca solo en cliente.

---

## 3. Contrato de Integración en `/run` (Propuesta Base)

Ambos módulos consumen tipos de `src/types/marathon.ts`:

```typescript
// Componente de Dev A (src/features/map/)
export interface HeartMapProps {
  role: UserRole; // Solo 'guide' emite GPS; 'friend' es solo lectura
  raceState: RaceState;
  checkpoints: Checkpoint[];
  route: RouteGeometry;
  onLocationUpdate?: (coords: Coordinates, distanceToNextMeters: number) => void;
  onCheckpointReached?: (checkpoint: Checkpoint) => void;
}

// Componente de Dev B (src/features/player/)
export interface RacePanelProps {
  session: PlayerSession;
  progress: RaceProgress;
  nextCheckpoint: Checkpoint | null;
  checkpoints: Checkpoint[];
  onManualUnlock?: (checkpoint: Checkpoint) => void; // Solo visible/activo para 'guide'
}
```

*(Si alguno necesita añadir o ajustar una prop, actualizar este bloque y avisar en la sección 5.)*

---

## 4. Esquema de Supabase (Pendiente — Dev B)
- *Por documentar cuando se cree el proyecto en Supabase (tablas, columnas y canal Realtime).*

---

## 5. Avisos y Notas de Cruce
- **Día 1 (Jaime):** Cambiamos la dinámica a **ruta única de 6 km en corazón** (todos juntos, 7 amigos en bola de nieve, Guía Km 0 emitiendo GPS y amigos en vivo en solo lectura). Contratos en `src/types/marathon.ts` actualizados y sincronizados en `main` y `dev`.
