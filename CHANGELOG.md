# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

## [Fase 5] - 2026-05-07

### Agregado
- **Documentación** (`docs/`)
  - `colmena-backend-handoff.md` - Guía completa para equipo backend
  - `ColmenaSaludFinanciera_v3.jsx` - Componente React final

### Fixes integrados
- Badge con etiquetas textuales (OK / Cuidado / ¡Límite!)
- Alert de categoría crítica en header
- Botón "Agregar" deshabilitado hasta input válido
- Score percentage en badge del semáforo

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
  - `ThemeToggleComponent` - Alterna modo claro/oscuro

### Fijo
- Tema oscuro con variables CSS personalizadas
- Bordes y colores de texto para accesibilidad en dark mode

## [Fase 3] - 2026-05-06

### Agregado
- Módulo de Salud Financiera completo
- Sistema de alertas (saludable/advertencia/critico)
- Gamificación (racha, XP, insignias)
- Tarjetas de categorías con barra de progreso

### Fijo
- Visualización de alertas
- Responsividad móvil
- Menú hamburguesa para móvil
- Badge overflow en header
- Encoding de tildes y ñ

## [Fase 1-2] - 2026-05-06

### Agregado
- Página Executive Summary (Resumen)
- Página Fase 1 - Research
- Página Fase 2 - Definición
- Componentes: PhaseHeader, SectionCard, KpiCard, PhaseRow

---

## Formato de commits

Usamos conventional commits:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `refactor:` Refactorización
- `docs:` Documentación
- `style:` Cambios de estilo (CSS)
