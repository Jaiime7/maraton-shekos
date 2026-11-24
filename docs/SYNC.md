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
- **Motor de mapa:** Google Maps JavaScript API vía `@vis.gl/react-google-maps`. No desmontar `<Map>` al actualizar coordenadas GPS (evita consumir cargas extra de cuota).
- **Escritura de GPS:** Solo los perfiles `fernando` y `carla` escriben `currentLocation` en Supabase. El rol `friend` es **solo lectura** para evitar saltos de pin entre los 7 amigos.
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
  activeSide: RouteSide;
  raceState: RaceState;
  checkpoints: Checkpoint[];
  routes: Record<RouteSide, RouteGeometry>;
  onLocationUpdate?: (coords: Coordinates, distanceToNextMeters: number) => void;
  onCheckpointReached?: (checkpoint: Checkpoint) => void;
}

// Componente de Dev B (src/features/player/)
export interface RacePanelProps {
  session: PlayerSession;
  teamProgress: TeamProgress;
  nextCheckpoint: Checkpoint | null;
  checkpoints: Checkpoint[];
  onManualUnlock: (checkpoint: Checkpoint) => void;
}
```

*(Si alguno necesita añadir o ajustar una prop, actualizar este bloque y avisar en la sección 5.)*

---

## 4. Esquema de Supabase (Pendiente — Dev B)
- *Por documentar cuando se cree el proyecto en Supabase (tablas, columnas y canal Realtime).*

---

## 5. Avisos y Notas de Cruce
- **Día 1 (Jaime):** Base del proyecto creada, `src/types/marathon.ts` congelado y `.env.example` listo. Arrancando Bloque 1 de Dev B con mocks.
