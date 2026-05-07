# COLMENA — Guía de Handoff para Backend
## Fase 5 · Entregable Final · Mayo 2026

---

## 1. Estructura de repositorio

```
colmena/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ColmenaUI.jsx          ← Átomos: Button, Input, Badge, Alert, Modal…
│   │   │   └── ColmenaSaludFinanciera_v3.jsx  ← Componente principal (Fase 5)
│   │   ├── data/
│   │   │   └── colmena-data-architecture.json ← Fuente de verdad (Fase 3 Etapa 1)
│   │   ├── hooks/
│   │   │   ├── useFinancialHealth.js   ← Lógica de score y semáforo
│   │   │   └── useGamification.js     ← Streak, XP, badges
│   │   ├── services/
│   │   │   └── api.js                 ← Capa de comunicación con backend
│   │   └── App.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           ← A implementar por el equipo de backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── movimientos.js
│   │   │   ├── categorias.js
│   │   │   ├── presupuestos.js
│   │   │   └── gamificacion.js
│   │   ├── models/
│   │   │   ├── Movimiento.js
│   │   │   ├── Presupuesto.js
│   │   │   └── Usuaria.js
│   │   └── app.js
│   └── package.json
│
└── README.md
```

---

## 2. Esquema de Base de Datos

### Tabla: `usuarias`
```sql
CREATE TABLE usuarias (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          VARCHAR(100) NOT NULL,
  email           VARCHAR(150) UNIQUE NOT NULL,
  telefono        VARCHAR(20),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `periodos`
```sql
CREATE TABLE periodos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuaria_id      UUID REFERENCES usuarias(id) ON DELETE CASCADE,
  mes             SMALLINT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  anio            SMALLINT NOT NULL,
  ingresos_mes    NUMERIC(12,2) NOT NULL DEFAULT 0,
  activo          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE (usuaria_id, mes, anio)
);
```

### Tabla: `presupuestos`
```sql
-- Límites que la usuaria define por categoría y periodo
CREATE TABLE presupuestos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuaria_id      UUID REFERENCES usuarias(id) ON DELETE CASCADE,
  periodo_id      UUID REFERENCES periodos(id) ON DELETE CASCADE,
  categoria_id    VARCHAR(30) NOT NULL,  -- cat_operativos | cat_fijos | cat_hormiga
  monto_limite    NUMERIC(12,2) NOT NULL,
  tipo            VARCHAR(20) NOT NULL,  -- porcentaje_de_ingresos | monto_fijo_mensual
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE (usuaria_id, periodo_id, categoria_id)
);
```

### Tabla: `movimientos`
```sql
-- Registro de cada gasto individual
CREATE TABLE movimientos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuaria_id      UUID REFERENCES usuarias(id) ON DELETE CASCADE,
  periodo_id      UUID REFERENCES periodos(id) ON DELETE CASCADE,
  categoria_id    VARCHAR(30) NOT NULL,
  subcategoria_id VARCHAR(40),
  monto           NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  descripcion     TEXT,
  comprobante_url TEXT,
  origen          VARCHAR(20) DEFAULT 'manual', -- manual | voz | foto_ticket
  estado          VARCHAR(20) DEFAULT 'confirmado', -- borrador | confirmado
  suma_al_streak  BOOLEAN DEFAULT TRUE,
  fecha_registro  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_movimientos_usuaria_periodo ON movimientos(usuaria_id, periodo_id);
CREATE INDEX idx_movimientos_categoria ON movimientos(categoria_id);
```

### Tabla: `estado_gamificacion`
```sql
CREATE TABLE estado_gamificacion (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuaria_id                  UUID REFERENCES usuarias(id) ON DELETE CASCADE UNIQUE,
  registro_consecutivo_dias   SMALLINT DEFAULT 0,
  ultimo_registro_fecha       DATE,
  xp_total                    INT DEFAULT 0,
  nivel_actual                SMALLINT DEFAULT 1,
  badges_obtenidos            JSONB DEFAULT '[]',
  retos_completados           JSONB DEFAULT '[]',
  updated_at                  TIMESTAMP DEFAULT NOW()
);
```

### Vista: `resumen_gastos_periodo`
```sql
CREATE VIEW resumen_gastos_periodo AS
  SELECT
    m.usuaria_id,
    m.periodo_id,
    m.categoria_id,
    SUM(m.monto)         AS total_gastado,
    COUNT(*)             AS num_movimientos,
    MAX(m.fecha_registro) AS ultimo_movimiento
  FROM movimientos m
  WHERE m.estado = 'confirmado'
  GROUP BY m.usuaria_id, m.periodo_id, m.categoria_id;
```

---

## 3. Endpoints REST

### Base URL: `/api/v1`
### Autenticación: Bearer JWT en header `Authorization`

---

### 3.1 Movimientos

#### `POST /movimientos`
Registra un nuevo gasto. Actualiza streak y XP automáticamente.

**Request body:**
```json
{
  "categoria_id":    "cat_hormiga",
  "subcategoria_id": "sub_antojos",
  "monto":           350.00,
  "descripcion":     "Café y snack",
  "origen":          "manual",
  "fecha_registro":  "2026-05-06"
}
```

**Response 201:**
```json
{
  "movimiento": {
    "id": "uuid",
    "categoria_id": "cat_hormiga",
    "monto": 350.00,
    "suma_al_streak": true,
    "created_at": "2026-05-06T14:32:00Z"
  },
  "feedback": {
    "categoria_id":   "cat_hormiga",
    "gasto_acumulado": 1450.00,
    "presupuesto":     1500.00,
    "pct_uso":         97,
    "estado":          "advertencia",
    "mensaje_alerta":  "¡Ojo! Llevas $1,450 en gastos personales",
    "xp_ganado":       10,
    "streak_actual":   4
  }
}
```

#### `GET /movimientos`
Lista movimientos del periodo activo con filtros opcionales.

**Query params:** `?categoria_id=cat_hormiga&fecha_desde=2026-05-01&limit=20&offset=0`

**Response 200:**
```json
{
  "data": [ /* array de movimientos */ ],
  "total": 12,
  "limit": 20,
  "offset": 0
}
```

#### `DELETE /movimientos/:id`
Elimina un movimiento. Recalcula el semáforo.

---

### 3.2 Salud Financiera (semáforo)

#### `GET /salud-financiera`
Devuelve el estado completo del módulo para renderizar el dashboard.

**Response 200:**
```json
{
  "periodo": {
    "mes": 5,
    "anio": 2026,
    "ingresos_mes": 18000.00
  },
  "score_global": 62,
  "estado_global": "advertencia",
  "categorias": [
    {
      "id":             "cat_fijos",
      "nombre":         "Gastos Fijos",
      "gasto_acumulado": 4700.00,
      "presupuesto":    5000.00,
      "pct_uso":        94,
      "estado":         "advertencia",
      "mensaje_alerta": "Ya comprometiste el 94% de tu presupuesto fijo"
    },
    {
      "id":             "cat_operativos",
      "gasto_acumulado": 5800.00,
      "presupuesto":    7200.00,
      "pct_uso":        81,
      "estado":         "advertencia",
      "mensaje_alerta": "Llevas el 81% de tu presupuesto operativo"
    },
    {
      "id":             "cat_hormiga",
      "gasto_acumulado": 1100.00,
      "presupuesto":    1500.00,
      "pct_uso":        73,
      "estado":         "saludable",
      "mensaje_alerta": null
    }
  ],
  "cat_mas_riesgosa": "cat_fijos",
  "gamificacion": {
    "streak_dias":    3,
    "xp_total":       120,
    "nivel_actual":   2,
    "meta_streak":    5,
    "badges_obtenidos": ["badge_primer_registro"]
  }
}
```

> **Nota FE:** El frontend ya no calcula el score ni el orden de categorías. Los consume directamente de este endpoint. El array `categorias` viene ordenado por `pct_uso` descendente (Fix #3 del lado del servidor).

---

### 3.3 Presupuestos

#### `GET /presupuestos`
Obtiene los presupuestos del periodo activo.

#### `PUT /presupuestos/:categoria_id`
Actualiza el límite de una categoría.

**Request body:**
```json
{
  "monto_limite": 6000.00,
  "tipo": "monto_fijo_mensual"
}
```

---

### 3.4 Gamificación

#### `GET /gamificacion/estado`
Estado actual de XP, streak y mini-retos.

#### `POST /gamificacion/retos/:reto_id/completar`
Marca un reto como completado. Devuelve XP ganado y badge desbloqueado si aplica.

---

## 4. Capa de servicio frontend (`services/api.js`)

```javascript
// services/api.js
const BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("colmena_token")}`,
});

export const api = {
  // Registrar gasto — devuelve feedback inmediato (Fix #1 Comportamiento #1)
  async registrarMovimiento(payload) {
    const res = await fetch(`${BASE}/movimientos`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw await res.json();
    return res.json(); // { movimiento, feedback }
  },

  // Cargar dashboard completo
  async getSaludFinanciera() {
    const res = await fetch(`${BASE}/salud-financiera`, { headers: headers() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Actualizar presupuesto de categoría
  async actualizarPresupuesto(categoriaId, payload) {
    const res = await fetch(`${BASE}/presupuestos/${categoriaId}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};
```

---

## 5. Contratos de integración FE ↔ BE

| Acción FE | Endpoint | Efecto BE |
|---|---|---|
| Usuaria agrega gasto | `POST /movimientos` | Guarda movimiento, recalcula score, actualiza streak |
| Componente monta | `GET /salud-financiera` | Devuelve estado completo ya ordenado |
| Usuaria cambia presupuesto | `PUT /presupuestos/:id` | Actualiza límite, devuelve nuevo estado |
| Streak se rompe | CRON diario 23:59 | Si no hay movimiento del día, resetea streak salvo día de gracia |

---

## 6. Variables de entorno requeridas

```bash
# Frontend (.env)
VITE_API_URL=https://api.colmena.app/v1

# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/colmena
JWT_SECRET=…
JWT_EXPIRES_IN=7d
PORT=3000
```

---

## 7. Checklist de entrega final

- [x] `colmena-data-architecture.json` — Fuente de verdad Fase 3
- [x] `ColmenaUI.jsx` — 9 componentes atómicos WCAG AA
- [x] `ColmenaSaludFinanciera_v3.jsx` — UI con 5 fixes de usabilidad
- [x] Esquema SQL completo (5 tablas + 1 vista)
- [x] Endpoints REST documentados con contratos request/response
- [x] Capa `api.js` lista para conectar
- [x] Variables de entorno definidas
- [ ] Implementación del backend (pendiente equipo BE)
- [ ] Auth JWT / OAuth (pendiente equipo BE)
- [ ] Deploy staging (pendiente DevOps)
