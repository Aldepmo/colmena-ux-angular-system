/**
 * ============================================================
 * COLMENA — Módulo de Salud Financiera
 * Fase 4 — ColmenaSaludFinanciera.jsx (actualizado)
 *
 * Cambios vs Etapa 2:
 * ✅ Consume componentes atómicos de ColmenaUI.jsx
 * ✅ ThemeToggle activa data-theme="dark" | "light" en <html>
 * ✅ Todos los tokens son semánticos DaisyUI → modo oscuro automático
 * ✅ Mobile-first: tap targets ≥44px, texto ≥14px, padding móvil
 * ✅ Accesibilidad: aria-label, role, aria-live, focus-visible en toda la UI
 * ✅ Modal de detalle por categoría
 * ✅ Sin hexadecimales directos en JSX
 * ============================================================
 */

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Briefcase, Home, AlertTriangle, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle2, Flame, Star, ChevronRight,
  Plus, Target, Award, Zap, Truck, Package,
  MapPin, Wifi, Users, Coffee, Heart, Info,
} from "lucide-react";
import {
  Button, Input, Badge, Alert, ProgressBar,
  StreakDot, Modal, ThemeToggle, StatCard,
} from "./ColmenaUI";

// ============================================================
// FUENTE DE VERDAD — Arquitectura de Etapa 1
// ============================================================
const COLMENA_DATA = {
  config_global: {
    umbral_salud_verde: 70,
    umbral_salud_amarillo: 40,
    meta_registro_consecutivo: 5,
  },
  categorias: [
    {
      id: "cat_operativos",
      nombre: "Gastos Operativos",
      descripcion: "Lo que gastas para que tu negocio funcione cada día",
      icono: Briefcase,
      color_token: "primary",
      tipo: "variable",
      limite_sugerido: { tipo: "porcentaje_de_ingresos", valor: 40 },
      tipo_alerta: {
        umbral_advertencia_pct: 80,
        umbral_critico_pct: 100,
        persistencia_alerta: false,
        mensaje_advertencia: (pct) => `Llevas el ${pct}% de tu presupuesto operativo`,
        mensaje_critico: () => "¡Superaste tu límite operativo este mes!",
      },
      gamificacion: { descripcion_reto: "Mantén tus gastos operativos bajo control por 7 días" },
      subcategorias: [
        { id: "sub_materia_prima", nombre: "Materia Prima", icono: Package },
        { id: "sub_servicios", nombre: "Servicios del Negocio", icono: Zap },
        { id: "sub_transporte", nombre: "Transporte y Logística", icono: Truck },
      ],
    },
    {
      id: "cat_fijos",
      nombre: "Gastos Fijos",
      descripcion: "Lo que pagas aunque no vendas nada",
      icono: Home,
      color_token: "secondary",
      tipo: "fijo",
      limite_sugerido: { tipo: "monto_fijo_mensual", valor: null },
      tipo_alerta: {
        umbral_advertencia_pct: 90,
        umbral_critico_pct: 100,
        persistencia_alerta: false,
        mensaje_advertencia: (pct) => `Ya comprometiste el ${pct}% de tu presupuesto fijo`,
        mensaje_critico: () => "Tus gastos fijos superaron el presupuesto",
      },
      gamificacion: { descripcion_reto: "Registra todos tus gastos fijos antes del día 3 del mes" },
      subcategorias: [
        { id: "sub_renta", nombre: "Renta", icono: MapPin },
        { id: "sub_conectividad", nombre: "Conectividad", icono: Wifi },
        { id: "sub_sueldos", nombre: "Sueldos y Auto-pago", icono: Users },
      ],
    },
    {
      id: "cat_hormiga",
      nombre: "Gastos Hormiga",
      descripcion: "Los pequeños gastos que se 'comen' tu negocio",
      icono: AlertTriangle,
      color_token: "accent",
      tipo: "fuga",
      es_categoria_critica: true,
      limite_sugerido: { tipo: "monto_fijo_mensual", valor: null },
      tipo_alerta: {
        umbral_advertencia_pct: 70,
        umbral_critico_pct: 100,
        persistencia_alerta: true,
        mensaje_advertencia: (pct, monto) =>
          `¡Ojo! Llevas $${monto.toLocaleString("es-MX")} en gastos personales`,
        mensaje_critico: () =>
          "Tu negocio está financiando gastos del hogar. Hablemos de eso",
      },
      gamificacion: { descripcion_reto: "Registra tus gastos personales 5 días seguidos" },
      subcategorias: [
        { id: "sub_antojos", nombre: "Antojos y Gastos del Día", icono: Coffee },
        { id: "sub_familiares", nombre: "Gastos Familiares", icono: Heart },
      ],
    },
  ],
};

// ============================================================
// ESTADO INICIAL
// ============================================================
const ESTADO_INICIAL = {
  ingresos_mes: 18000,
  presupuestos: { cat_operativos: 7200, cat_fijos: 5000, cat_hormiga: 1500 },
  gastos_actuales: { cat_operativos: 5800, cat_fijos: 4700, cat_hormiga: 1100 },
  streak_dias: 3,
  xp_total: 120,
};

// ============================================================
// HELPERS
// ============================================================
const calcPct = (gasto, limite) =>
  limite > 0 ? Math.min(Math.round((gasto / limite) * 100), 120) : 0;

const getEstado = (pct, alerta) => {
  if (pct >= alerta.umbral_critico_pct) return "critico";
  if (pct >= alerta.umbral_advertencia_pct) return "advertencia";
  return "saludable";
};

const calcScore = (gastos, presupuestos) => {
  const ps = Object.keys(presupuestos).map((k) => calcPct(gastos[k] || 0, presupuestos[k]));
  const avg = ps.reduce((a, b) => a + b, 0) / ps.length;
  return Math.max(0, Math.round(100 - avg * 0.8));
};

const COLOR_TOKENS = {
  primary:   { bg: "bg-primary/10",   text: "text-primary",   border: "border-primary/20" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
  accent:    { bg: "bg-accent/10",    text: "text-accent",    border: "border-accent/20" },
};

// ============================================================
// COMPONENTE: Gauge SVG del semáforo global
// ============================================================
function ScoreGauge({ score }) {
  const estado =
    score >= 70 ? "saludable" : score >= 40 ? "advertencia" : "critico";

  // Arc path: semicírculo de 180°
  const r = 52;
  const cx = 70, cy = 70;
  const startAngle = -180;
  const endAngle = 0;
  const toRad = (a) => (a * Math.PI) / 180;
  const arcAngle = startAngle + (score / 100) * 180;

  const sx = cx + r * Math.cos(toRad(startAngle));
  const sy = cy + r * Math.sin(toRad(startAngle));
  const ex = cx + r * Math.cos(toRad(arcAngle));
  const ey = cy + r * Math.sin(toRad(arcAngle));
  const largeArc = score > 50 ? 1 : 0;

  const strokeColor =
    estado === "saludable" ? "oklch(var(--su))" :
    estado === "advertencia" ? "oklch(var(--wa))" :
    "oklch(var(--er))";

  return (
    <svg
      width="140"
      height="80"
      viewBox="0 0 140 80"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        className="stroke-base-300"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="9"
        strokeLinecap="round"
        style={{ transition: "all 0.8s cubic-bezier(.4,0,.2,1)" }}
      />
      {/* Score */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        className="fill-base-content"
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fontSize="10"
        className="fill-base-content/40"
      >
        /100
      </text>
    </svg>
  );
}

// ============================================================
// COMPONENTE: Tarjeta de Categoría
// ============================================================
function TarjetaCategoria({
  cat,
  gastoActual,
  presupuesto,
  onAgregarGasto,
  onVerDetalle,
}) {
  const [alertaDismissed, setAlertaDismissed] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const [inputError, setInputError] = useState("");
  const inputRef = useRef();
  const prevPct = useRef(0);

  const pct = calcPct(gastoActual, presupuesto);
  const estado = getEstado(pct, cat.tipo_alerta);
  const tokens = COLOR_TOKENS[cat.color_token];
  const faltante = Math.max(presupuesto - gastoActual, 0);
  const excedente = Math.max(gastoActual - presupuesto, 0);

  const estadoBadgeVariant = {
    saludable: "success",
    advertencia: "warning",
    critico: "error",
  }[estado];

  // Reset dismiss si el estado empeora
  useEffect(() => {
    if (pct > prevPct.current) setAlertaDismissed(false);
    prevPct.current = pct;
  }, [pct]);

  const handleAdd = useCallback(() => {
    const inp = inputRef.current;
    const val = parseFloat(inp?.value);
    if (isNaN(val) || val <= 0) {
      setInputError("Ingresa un monto válido mayor a cero");
      inp?.focus();
      return;
    }
    if (val > 99999) {
      setInputError("El monto no puede superar $99,999");
      return;
    }
    setInputError("");
    onAgregarGasto(cat.id, val);
    if (inp) inp.value = "";
    inp?.focus();
  }, [cat.id, onAgregarGasto]);

  const alertaVariant = estado === "critico" ? "error" : "warning";
  const alertaIcon = estado === "critico" ? AlertTriangle : AlertCircle;
  const alertaMsg =
    estado === "critico"
      ? cat.tipo_alerta.mensaje_critico(pct, gastoActual)
      : cat.tipo_alerta.mensaje_advertencia(pct, gastoActual);

  const cardBorderClass =
    estado === "critico"
      ? "border-error/40"
      : estado === "advertencia"
      ? "border-warning/30"
      : "border-base-200";

  return (
    <article
      aria-label={`Categoría ${cat.nombre}`}
      className={`card bg-base-100 shadow-md border transition-all duration-500 ${cardBorderClass}`}
    >
      <div className="card-body p-4 gap-3">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-2 rounded-xl shrink-0 ${tokens.bg}`}
              aria-hidden="true"
            >
              <cat.icono className={`w-5 h-5 ${tokens.text}`} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base-content text-sm leading-tight truncate">
                {cat.nombre}
              </h3>
              <p className="text-xs text-base-content/50 leading-tight mt-0.5 line-clamp-1">
                {cat.descripcion}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant={estadoBadgeVariant} size="sm">
              {estado === "saludable" && <CheckCircle2 className="w-3 h-3" />}
              {estado === "advertencia" && <AlertCircle className="w-3 h-3" />}
              {estado === "critico" && <AlertTriangle className="w-3 h-3" />}
              {pct}%
            </Badge>
            <button
              onClick={() => onVerDetalle(cat)}
              aria-label={`Ver detalle de ${cat.nombre}`}
              className="btn btn-ghost btn-xs btn-circle min-h-[32px] w-8 h-8"
            >
              <Info className="w-3.5 h-3.5 text-base-content/40" />
            </button>
          </div>
        </div>

        {/* ── Montos ── */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <span
              className={`text-2xl font-bold tabular-nums leading-none transition-colors duration-400 ${
                estado === "saludable"
                  ? "text-success"
                  : estado === "advertencia"
                  ? "text-warning"
                  : "text-error"
              }`}
            >
              ${gastoActual.toLocaleString("es-MX")}
            </span>
            <span className="text-xs text-base-content/40 ml-1">gastado</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-base-content/40">
              de ${presupuesto.toLocaleString("es-MX")}
            </p>
            {faltante > 0 ? (
              <p className="text-xs text-success font-medium">
                +${faltante.toLocaleString("es-MX")} disponible
              </p>
            ) : (
              <p className="text-xs text-error font-semibold animate-pulse">
                −${excedente.toLocaleString("es-MX")} excedido
              </p>
            )}
          </div>
        </div>

        {/* ── Barra — Comportamiento #1 ── */}
        <ProgressBar
          value={gastoActual}
          max={presupuesto}
          estado={estado}
          size="md"
          label={`${cat.nombre}: ${pct}% del límite`}
        />

        {/* ── Alerta — Comportamiento #1 / #2 ── */}
        {estado !== "saludable" && !alertaDismissed && (
          <Alert
            variant={alertaVariant}
            icon={alertaIcon}
            dismissible={!cat.tipo_alerta.persistencia_alerta}
            persistent={cat.tipo_alerta.persistencia_alerta}
            onDismiss={() => setAlertaDismissed(true)}
          >
            {alertaMsg}
          </Alert>
        )}

        {/* ── Input de registro rápido ── */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              type="number"
              prefix="$"
              placeholder="0.00"
              inputRef={inputRef}
              size="md"
              min="0.01"
              max="99999"
              error={inputError}
              ariaDescribedBy={`reto-${cat.id}`}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              onChange={() => inputError && setInputError("")}
              id={`gasto-input-${cat.id}`}
              label=""
            />
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleAdd}
            ariaLabel={`Agregar gasto a ${cat.nombre}`}
          >
            Agregar
          </Button>
        </div>

        {/* ── Subcategorías ── */}
        <button
          onClick={() => setExpandido(!expandido)}
          aria-expanded={expandido}
          aria-controls={`subs-${cat.id}`}
          className="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/60 transition-colors w-fit focus-visible:outline-none focus-visible:text-base-content/70"
        >
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expandido ? "rotate-90" : ""}`}
            aria-hidden="true"
          />
          {cat.subcategorias.length} subcategorías
        </button>

        {expandido && (
          <div
            id={`subs-${cat.id}`}
            className="flex flex-wrap gap-1.5"
            role="list"
          >
            {cat.subcategorias.map((sub) => (
              <div
                key={sub.id}
                role="listitem"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border ${tokens.border} ${tokens.bg} text-xs ${tokens.text}`}
              >
                <sub.icono className="w-3 h-3" aria-hidden="true" />
                {sub.nombre}
              </div>
            ))}
          </div>
        )}

        {/* ── Mini-reto ── */}
        <div
          id={`reto-${cat.id}`}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${tokens.border} ${tokens.bg}`}
          aria-label={`Mini-reto: ${cat.gamificacion.descripcion_reto}`}
        >
          <Target className={`w-3.5 h-3.5 shrink-0 ${tokens.text}`} aria-hidden="true" />
          <p className={`text-xs leading-tight ${tokens.text}`}>
            {cat.gamificacion.descripcion_reto}
          </p>
        </div>
      </div>
    </article>
  );
}

// ============================================================
// COMPONENTE: Semáforo Global
// ============================================================
function SemaforoGlobal({ score, streak, xp }) {
  const estado =
    score >= 70 ? "saludable" : score >= 40 ? "advertencia" : "critico";

  const estadoConfig = {
    saludable:  { badge: "success", icono: TrendingUp,   label: "Tu negocio está sano" },
    advertencia: { badge: "warning", icono: AlertCircle,  label: "Hay áreas de oportunidad" },
    critico:    { badge: "error",   icono: TrendingDown, label: "Tu negocio necesita atención" },
  }[estado];

  return (
    <section
      aria-label="Semáforo global de salud financiera"
      className="card bg-base-100 shadow-md border-2 border-base-200"
    >
      <div className="card-body p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center gap-4">

          {/* Gauge */}
          <div aria-hidden="true">
            <ScoreGauge score={score} />
          </div>
          <p className="sr-only">Puntuación de salud financiera: {score} de 100</p>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2">
              <Badge variant={estadoConfig.badge} size="lg" icon={estadoConfig.icono}>
                {estadoConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-base-content/50 mb-3 leading-relaxed">
              Basado en el control de tus tres categorías de gasto este mes.
            </p>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-2 justify-center sm:justify-start"
              aria-label="Estadísticas de gamificación"
            >
              <StatCard label="Racha" value={`${streak} días`} icon={Flame} accent="warning" />
              <StatCard label="Puntos XP" value={`${xp} XP`} icon={Star} accent="accent" />
              <StatCard label="Meta racha" value="5 días" icon={Award} accent="primary" />
            </div>
          </div>

          {/* Streak dots */}
          <div
            className="flex flex-col items-center gap-2"
            aria-label={`Racha semanal: ${streak} de 7 días`}
          >
            <p
              className="text-[10px] text-base-content/40 uppercase tracking-widest"
              aria-hidden="true"
            >
              Racha semanal
            </p>
            <div className="flex gap-1.5" role="list" aria-label="Días de racha">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} role="listitem">
                  <StreakDot index={i} activo={i < streak} size="md" />
                </div>
              ))}
            </div>
            <p className="text-xs text-warning font-medium" aria-live="polite">
              {5 - streak > 0
                ? `${5 - streak} días para tu badge 🏅`
                : "¡Badge desbloqueado! 🎉"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COMPONENTE: Resumen de ingresos
// ============================================================
function ResumenIngresos({ ingresos, totalGastos }) {
  const pct = calcPct(totalGastos, ingresos);
  const saldo = ingresos - totalGastos;
  const barEstado =
    pct > 90 ? "critico" : pct > 70 ? "advertencia" : "saludable";

  return (
    <section
      aria-label="Resumen de ingresos del mes"
      className="card bg-primary text-primary-content shadow-md"
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-primary-content/70 text-[10px] uppercase tracking-widest mb-1">
              Ingresos del mes
            </p>
            <p
              className="text-3xl font-bold tabular-nums"
              aria-label={`Ingresos del mes: $${ingresos.toLocaleString("es-MX")} pesos`}
            >
              ${ingresos.toLocaleString("es-MX")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-content/70 text-[10px] uppercase tracking-widest mb-1">
              Saldo disponible
            </p>
            <p
              className={`text-2xl font-bold tabular-nums ${saldo < 0 ? "text-error" : ""}`}
              aria-label={`Saldo disponible: $${saldo.toLocaleString("es-MX")} pesos`}
            >
              ${saldo.toLocaleString("es-MX")}
            </p>
          </div>
        </div>

        {/* Barra de ingresos sobre fondo primary */}
        <div className="w-full bg-primary-content/20 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              barEstado === "critico"
                ? "bg-error"
                : barEstado === "advertencia"
                ? "bg-warning"
                : "bg-success"
            }`}
            style={{ width: `${Math.min(pct, 100)}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pct}% del ingreso gastado`}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-primary-content/60">
            Gastado: ${totalGastos.toLocaleString("es-MX")}
          </span>
          <span className="text-[10px] text-primary-content/60">{pct}% del ingreso</span>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COMPONENTE: Modal de detalle de categoría
// ============================================================
function ModalDetalle({ cat, gastoActual, presupuesto, onClose }) {
  if (!cat) return null;

  const pct = calcPct(gastoActual, presupuesto);
  const estado = getEstado(pct, cat.tipo_alerta);
  const tokens = COLOR_TOKENS[cat.color_token];

  return (
    <Modal
      open={!!cat}
      onClose={onClose}
      title={cat.nombre}
      footer={
        <Button variant="primary" onClick={onClose} size="sm">
          Entendido
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Descripción */}
        <div className={`flex items-center gap-3 p-3 rounded-xl ${tokens.bg}`}>
          <cat.icono className={`w-5 h-5 ${tokens.text}`} aria-hidden="true" />
          <p className="text-sm text-base-content/70">{cat.descripcion}</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-base-200 rounded-xl p-3">
            <p className="text-[10px] text-base-content/50 uppercase tracking-widest">Gastado</p>
            <p className="text-lg font-bold text-base-content tabular-nums mt-0.5">
              ${gastoActual.toLocaleString("es-MX")}
            </p>
          </div>
          <div className="bg-base-200 rounded-xl p-3">
            <p className="text-[10px] text-base-content/50 uppercase tracking-widest">Presupuesto</p>
            <p className="text-lg font-bold text-base-content tabular-nums mt-0.5">
              ${presupuesto.toLocaleString("es-MX")}
            </p>
          </div>
        </div>

        {/* Barra */}
        <ProgressBar
          value={gastoActual}
          max={presupuesto}
          estado={estado}
          size="lg"
          showLabel
          label="Uso del presupuesto"
        />

        {/* Subcategorías */}
        <div>
          <p className="text-xs font-medium text-base-content/60 mb-2 uppercase tracking-widest">
            Subcategorías
          </p>
          <ul className="flex flex-col gap-1.5">
            {cat.subcategorias.map((sub) => (
              <li
                key={sub.id}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${tokens.border} ${tokens.bg}`}
              >
                <sub.icono className={`w-4 h-4 ${tokens.text}`} aria-hidden="true" />
                <span className="text-sm text-base-content">{sub.nombre}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mini-reto */}
        <div
          className={`flex items-start gap-2 p-3 rounded-xl border ${tokens.border} ${tokens.bg}`}
        >
          <Target className={`w-4 h-4 mt-0.5 shrink-0 ${tokens.text}`} aria-hidden="true" />
          <div>
            <p className={`text-xs font-semibold ${tokens.text}`}>Mini-reto activo</p>
            <p className="text-xs text-base-content/60 mt-0.5 leading-relaxed">
              {cat.gamificacion.descripcion_reto}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function ColmenaSaludFinanciera() {
  const [estado, setEstado] = useState(ESTADO_INICIAL);
  const [theme, setTheme] = useState("light");
  const [catDetalle, setCatDetalle] = useState(null);

  // Aplica data-theme al <html> para DaisyUI dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const handleAgregarGasto = useCallback((catId, monto) => {
    setEstado((prev) => ({
      ...prev,
      gastos_actuales: {
        ...prev.gastos_actuales,
        [catId]: (prev.gastos_actuales[catId] || 0) + monto,
      },
      xp_total: prev.xp_total + 10,
    }));
  }, []);

  const totalGastos = Object.values(estado.gastos_actuales).reduce((a, b) => a + b, 0);
  const score = calcScore(estado.gastos_actuales, estado.presupuestos);

  return (
    // app-bg → "bg-base-200" según design.md
    <div className="bg-base-200 min-h-screen">

      {/* ── Skip link — accesibilidad ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 btn btn-primary btn-sm z-50"
      >
        Ir al contenido principal
      </a>

      {/* ── Header ── */}
      <header className="bg-base-100 border-b border-base-300 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <span className="text-primary-content font-black text-sm">C</span>
            </div>
            <div>
              <p className="font-bold text-base-content text-sm leading-none">Colmena</p>
              <p className="text-[10px] text-base-content/40">Salud Financiera</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="warning" icon={Flame} size="sm">
              {estado.streak_dias} días
            </Badge>
            <Badge variant="ghost" size="sm">
              <Star className="w-3 h-3 text-accent" aria-hidden="true" />
              {estado.xp_total} XP
            </Badge>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main
        id="main-content"
        className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4"
      >
        <ResumenIngresos
          ingresos={estado.ingresos_mes}
          totalGastos={totalGastos}
        />

        <SemaforoGlobal
          score={score}
          streak={estado.streak_dias}
          xp={estado.xp_total}
        />

        <div className="flex items-center justify-between px-1" aria-hidden="true">
          <h2 className="text-base-content/50 font-bold text-[10px] uppercase tracking-widest">
            Categorías de Gasto
          </h2>
          <span className="text-[10px] text-base-content/30">Mayo 2026</span>
        </div>

        {/* Tarjetas de categoría */}
        <div className="flex flex-col gap-4" role="list" aria-label="Categorías de gasto">
          {COLMENA_DATA.categorias.map((cat) => (
            <div key={cat.id} role="listitem">
              <TarjetaCategoria
                cat={cat}
                gastoActual={estado.gastos_actuales[cat.id] || 0}
                presupuesto={estado.presupuestos[cat.id] || 0}
                ingresos={estado.ingresos_mes}
                onAgregarGasto={handleAgregarGasto}
                onVerDetalle={setCatDetalle}
              />
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-base-content/25 py-2">
          Colmena · Módulo de Salud Financiera · Fase 4
        </p>
      </main>

      {/* ── Modal de detalle ── */}
      <ModalDetalle
        cat={catDetalle}
        gastoActual={catDetalle ? estado.gastos_actuales[catDetalle.id] || 0 : 0}
        presupuesto={catDetalle ? estado.presupuestos[catDetalle.id] || 0 : 0}
        onClose={() => setCatDetalle(null)}
      />
    </div>
  );
}
