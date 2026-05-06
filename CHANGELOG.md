# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

## [Fase 4] - 2026-05-06

### Agregado
- **Componentes Atómicos** (`src/app/components/atoms/`)
  - `ButtonComponent` - Botón con variantes (primary, secondary, ghost, danger, outline)
  - `InputComponent` - Input con label, hint, error, prefix/suffix
  - `BadgeComponent` - Badge con variantes (success, warning, error, info, neutral)
  - `AlertComponent` - Alerta con dismissible y persistent
  - `ProgressBarComponent` - Barra de progreso con estados
  - `StreakDotComponent` - Dots para rachas diarias
  - `ModalComponent` - Modal con focus trap
  - `StatCardComponent` - Tarjeta de estadísticas

### Migrado
- `phase-header.component.ts` → usa `BadgeComponent`
- `salud-financiera.component.ts` header → usa `StatCardComponent`

## [Fase 3] - 2026-05-06

### Agregado
- Módulo de Salud Financiera
- Sistema de alertas (saludable/advertencia/critico)
- Gamificación (racha, XP,-insignias)
- Tarjetas de categorías con progresso

### Fijo
- Visualización de alertas
- Responsividad móvil
- Menú hamburguesa para móvil
- Badge overflow en header

---

## Formato de commits

Usamos conventional commits:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `refactor:` Refactorización
- `docs:` Documentación
- `style:` Cambios de estilo (CSS)