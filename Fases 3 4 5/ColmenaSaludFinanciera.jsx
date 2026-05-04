/**
 * ============================================================
 * COLMENA — Módulo de Salud Financiera
 * Fase 3, Etapa 2 — Prototipado en Código de Alta Fidelidad
 * Stack: React + Tailwind + DaisyUI + Lucide React
 * Tokens: Estrictamente según design.md
 * Comportamiento #1: Retroalimentación Inmediata activa
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import {
  Briefcase, Home, AlertTriangle, TrendingUp, TrendingDown,
  AlertCircle, Zap, Truck, Package, MapPin, Wifi, Users,
  Coffee, Heart, Star, Flame, ChevronRight, Plus, X,
  CheckCircle2, Clock, Target, Award
} from "lucide-react";

// ============================================================
// FUENTE DE VERDAD — Datos de la arquitectura Fase 3 Etapa 1
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
      icono: "briefcase",
      color_token: "primary",
      tipo: "variable",
      limite_sugerido: { tipo: "porcentaje_de_ingresos", valor: 40 },
      tipo_alerta: {
        nivel_advertencia: "warning",
        nivel_critico: "error",
        umbral_advertencia_pct: 80,
        umbral_critico_pct: 100,
        mensaje_advertencia: "Llevas el {pct}% de tu presupuesto operativo",
        mensaje_critico: "¡Superaste tu límite operativo este mes!",
      },
      gamificacion: {
        descripcion_reto: "Mantén tus gastos operativos bajo control por 7 días",
        recompensa_badge: "badge_control_operativo",
      },
      subcategorias: [
        { id: "sub_materia_prima", nombre: "Materia Prima", icono: "package" },
        { id: "sub_servicios_negocio", nombre: "Servicios del Negocio", icono: "zap" },
        { id: "sub_transporte", nombre: "Transporte y Logística", icono: "truck" },
      ],
    },
    {
      id: "cat_fijos",
      nombre: "Gastos Fijos",
      descripcion: "Lo que pagas aunque no vendas nada",
      icono: "home",
      color_token: "secondary",
      tipo: "fijo",
      limite_sugerido: { tipo: "monto_fijo_mensual", valor: null },
      tipo_alerta: {
        nivel_advertencia: "info",
        nivel_critico: "warning",
        umbral_advertencia_pct: 90,
        umbral_critico_pct: 100,
        mensaje_advertencia: "Ya comprometiste el {pct}% de tu presupuesto fijo",
        mensaje_critico: "Tus gastos fijos superaron el presupuesto.",
      },
      gamificacion: {
        descripcion_reto: "Registra todos tus gastos fijos antes del día 3 del mes",
        recompensa_badge: "badge_negocio_ordenado",
      },
      subcategorias: [
        { id: "sub_renta", nombre: "Renta", icono: "map-pin" },
        { id: "sub_conectividad", nombre: "Conectividad", icono: "wifi" },
        { id: "sub_sueldos", nombre: "Sueldos y Auto-pago", icono: "users" },
      ],
    },
    {
      id: "cat_hormiga",
      nombre: "Gastos Hormiga",
      descripcion: "Los pequeños gastos que se 'comen' tu negocio sin que te des cuenta",
      icono: "alert-triangle",
      color_token: "accent",
      tipo: "fuga",
      es_categoria_critica: true,
      limite_sugerido: { tipo: "monto_fijo_mensual", valor: null },
      tipo_alerta: {
        nivel_advertencia: "warning",
        nivel_critico: "error",
        umbral_advertencia_pct: 70,
        umbral_critico_pct: 100,
        persistencia_alerta: true,
        requiere_confirmacion_lectura: true,
        mensaje_advertencia: "¡Ojo! Llevas ${monto} en gastos personales esta semana",
        mensaje_critico: "Tu negocio está financiando gastos del hogar. Hablemos de eso 👀",
      },
      gamificacion: {
        descripcion_reto: "Registra tus gastos personales 5 días seguidos",
        recompensa_badge: "badge_separacion_financiera",
      },
      subcategorias: [
        { id: "sub_antojos", nombre: "Antojos y Gastos del Día", icono: "coffee" },
        { id: "sub_familiares", nombre: "Gastos Familiares", icono: "heart" },
      ],
    },
  ],
  gamificacion: {
    estado_usuaria: {
      registro_consecutivo_dias: 3,
      xp_total: 120,
      nivel_actual: 2,
      badges_obtenidos: ["badge_primer_registro"],
    },
    reglas_streak: {
      hito_2: { dias: 5, mensaje: "¡Una semana de hábito! Eres imparable" },
    },
  },
};

// ============================================================
// ESTADO INICIAL — Presupuestos e ingresos de la usuaria
// (Simula datos guardados; en prod vendría del backend)
// ============================================================
const ESTADO_INICIAL = {
  ingresos_mes: 18000,
  presupuestos: {
    cat_operativos: 7200,  // 40% de 18000
    cat_fijos: 5000,
    cat_hormiga: 1500,
  },
  gastos_actuales: {
    cat_operativos: 5800,
    cat_fijos: 4700,
    cat_hormiga: 1100,
  },
  streak_dias: 3,
  xp_total: 120,
};

// ============================================================
// HELPERS
// ============================================================
const calcPct = (gasto, limite) =>
  limite > 0 ? Math.min(Math.round((gasto / limite) * 100), 120) : 0;

const getSemaforoEstado = (pct, alerta) => {
  if (pct >= alerta.umbral_critico_pct) return "critico";
  if (pct >= alerta.umbral_advertencia_pct) return "advertencia";
  return "saludable";
};

const getSemaforoScore = (gastos, presupuestos, ingresos) => {
  const pctOp = calcPct(gastos.cat_operativos, presupuestos.cat_operativos);
  const pctFijo = calcPct(gastos.cat_fijos, presupuestos.cat_fijos);
  const pctHormiga = calcPct(gastos.cat_hormiga, presupuestos.cat_hormiga);
  const avgPct = (pctOp + pctFijo + pctHormiga) / 3;
  return Math.max(0, Math.round(100 - avgPct * 0.8));
};

// Mapa de iconos Lucide por nombre
const IconMap = {
  briefcase: Briefcase, home: Home, "alert-triangle": AlertTriangle,
  package: Package, zap: Zap, truck: Truck,
  "map-pin": MapPin, wifi: Wifi, users: Users,
  coffee: Coffee, heart: Heart,
};

const LucideIcon = ({ name, className }) => {
  const Icon = IconMap[name] || AlertCircle;
  return <Icon className={className} />;
};

// ============================================================
// TOKENS DaisyUI → Tailwind classes (alias de design.md)
// ============================================================
const TOKEN = {
  // surfaces
  "app-bg": "bg-base-200",
  card: "card bg-base-100 shadow-xl",
  // actions
  "primary-default": "btn btn-primary",
  "secondary-default": "btn btn-secondary",
  // content
  "text-primary": "text-base-content",
  "heading-xl": "text-5xl font-bold",
  // semáforo → color tokens
  saludable: {
    bar: "bg-success",
    badge: "badge badge-success",
    text: "text-success",
    alert: "alert alert-success",
    glow: "shadow-success/30",
  },
  advertencia: {
    bar: "bg-warning",
    badge: "badge badge-warning",
    text: "text-warning",
    alert: "alert alert-warning",
    glow: "shadow-warning/30",
  },
  critico: {
    bar: "bg-error",
    badge: "badge badge-error",
    text: "text-error",
    alert: "alert alert-error",
    glow: "shadow-error/40",
  },
  info: {
    bar: "bg-info",
    badge: "badge badge-info",
    text: "text-info",
    alert: "alert alert-info",
    glow: "shadow-info/20",
  },
  primary: { accent: "text-primary", border: "border-primary/30", bg: "bg-primary/10" },
  secondary: { accent: "text-secondary", border: "border-secondary/30", bg: "bg-secondary/10" },
  accent: { accent: "text-accent", border: "border-accent/30", bg: "bg-accent/10" },
};

// ============================================================
// SUB-COMPONENTE: Barra de Progreso Animada
// Comportamiento #1: color cambia en tiempo real
// ============================================================
const BarraProgreso = ({ pct, estado, animado = true }) => {
  const clrMap = { saludable: TOKEN.saludable.bar, advertencia: TOKEN.advertencia.bar, critico: TOKEN.critico.bar };
  const clr = clrMap[estado] || TOKEN.saludable.bar;
  const ancho = Math.min(pct, 100);

  return (
    <div className="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${clr} ${
          estado === "critico" ? "animate-pulse" : ""
        }`}
        style={{ width: `${ancho}%` }}
      />
    </div>
  );
};

// ============================================================
// SUB-COMPONENTE: Alerta de Feedback Inmediato
// Comportamiento #1 + #2 (persistencia en categoría crítica)
// ============================================================
const AlertaFeedback = ({ estado, cat, pct, monto, onDismiss, persistente }) => {
  if (estado === "saludable") return null;

  const cfg = estado === "critico"
    ? { cls: TOKEN.critico.alert, icon: <AlertTriangle className="w-4 h-4 shrink-0" />, msg: cat.tipo_alerta.mensaje_critico }
    : { cls: TOKEN.advertencia.alert, icon: <AlertCircle className="w-4 h-4 shrink-0" />, msg: cat.tipo_alerta.mensaje_advertencia };

  const msg = cfg.msg
    .replace("{pct}", pct)
    .replace("{monto}", `$${monto.toLocaleString("es-MX")}`);

  return (
    <div className={`${cfg.cls} py-2 px-3 rounded-xl mt-2 flex items-start gap-2 text-sm`}>
      {cfg.icon}
      <span className="flex-1 leading-tight">{msg}</span>
      {!persistente && (
        <button onClick={onDismiss} className="btn btn-ghost btn-xs p-0 min-h-0 h-auto opacity-60 hover:opacity-100">
          <X className="w-3 h-3" />
        </button>
      )}
      {persistente && cat.tipo_alerta.requiere_confirmacion_lectura && (
        <span className="badge badge-outline badge-xs opacity-70">Requiere revisión</span>
      )}
    </div>
  );
};

// ============================================================
// SUB-COMPONENTE: Input rápido de gasto
// ============================================================
const InputGasto = ({ catId, onAgregar }) => {
  const [val, setVal] = useState("");
  const inputRef = useRef();

  const handleAdd = () => {
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      onAgregar(catId, n);
      setVal("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      <div className="join flex-1">
        <span className="join-item flex items-center px-3 bg-base-200 text-base-content/50 text-sm border border-base-300 rounded-l-xl">
          $
        </span>
        <input
          ref={inputRef}
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="0.00"
          className="input input-bordered input-sm flex-1 join-item focus:outline-none focus:border-primary text-sm"
        />
      </div>
      <button onClick={handleAdd} className="btn btn-primary btn-sm gap-1 rounded-xl">
        <Plus className="w-3.5 h-3.5" />
        Agregar
      </button>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL: Tarjeta de Categoría
// ============================================================
const TarjetaCategoria = ({ cat, gastoActual, presupuesto, ingresos, onAgregarGasto }) => {
  const [alertaDismissed, setAlertaDismissed] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const prevPct = useRef(0);

  const pct = calcPct(gastoActual, presupuesto);
  const estado = getSemaforoEstado(pct, cat.tipo_alerta);
  const colorToken = TOKEN[cat.color_token] || TOKEN.primary;
  const semaforoToken = TOKEN[estado] || TOKEN.saludable;

  // Comportamiento #1: Reset dismiss cuando cambia el estado a peor
  useEffect(() => {
    if (pct > prevPct.current) setAlertaDismissed(false);
    prevPct.current = pct;
  }, [pct]);

  const faltante = Math.max(presupuesto - gastoActual, 0);
  const excedente = Math.max(gastoActual - presupuesto, 0);

  return (
    <div
      className={`card bg-base-100 shadow-xl border ${
        estado === "critico"
          ? "border-error/40 shadow-error/20"
          : estado === "advertencia"
          ? "border-warning/30"
          : "border-base-200"
      } transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5`}
    >
      <div className="card-body p-4 gap-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${colorToken.bg}`}>
              <LucideIcon name={cat.icono} className={`w-5 h-5 ${colorToken.accent}`} />
            </div>
            <div>
              <h3 className="font-semibold text-base-content text-sm leading-tight">{cat.nombre}</h3>
              <p className="text-xs text-base-content/50 leading-tight mt-0.5">{cat.descripcion}</p>
            </div>
          </div>

          {/* Badge semáforo */}
          <div className={`${semaforoToken.badge} gap-1 shrink-0 text-xs`}>
            {estado === "saludable" && <CheckCircle2 className="w-3 h-3" />}
            {estado === "advertencia" && <AlertCircle className="w-3 h-3" />}
            {estado === "critico" && <AlertTriangle className="w-3 h-3" />}
            {pct}%
          </div>
        </div>

        {/* Montos */}
        <div className="flex items-end justify-between">
          <div>
            <span className={`text-2xl font-bold ${semaforoToken.text} tabular-nums leading-none`}>
              ${gastoActual.toLocaleString("es-MX")}
            </span>
            <span className="text-xs text-base-content/40 ml-1">gastado</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-base-content/40">de ${presupuesto.toLocaleString("es-MX")}</p>
            {faltante > 0 ? (
              <p className="text-xs text-success font-medium">+${faltante.toLocaleString("es-MX")} disponible</p>
            ) : (
              <p className="text-xs text-error font-medium animate-pulse">
                -${excedente.toLocaleString("es-MX")} excedido
              </p>
            )}
          </div>
        </div>

        {/* Barra de progreso — Comportamiento #1 */}
        <BarraProgreso pct={pct} estado={estado} />

        {/* Alerta de feedback inmediato — Comportamiento #1 */}
        {!alertaDismissed && (
          <AlertaFeedback
            estado={estado}
            cat={cat}
            pct={pct}
            monto={gastoActual}
            onDismiss={() => setAlertaDismissed(true)}
            persistente={cat.tipo_alerta.persistencia_alerta}
          />
        )}

        {/* Input de registro rápido */}
        <InputGasto catId={cat.id} onAgregar={onAgregarGasto} />

        {/* Subcategorías colapsables */}
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/70 transition-colors w-fit"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandido ? "rotate-90" : ""}`} />
          {cat.subcategorias.length} subcategorías
        </button>

        {expandido && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {cat.subcategorias.map((sub) => (
              <div
                key={sub.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${colorToken.border} ${colorToken.bg} text-xs ${colorToken.accent}`}
              >
                <LucideIcon name={sub.icono} className="w-3 h-3" />
                {sub.nombre}
              </div>
            ))}
          </div>
        )}

        {/* Mini-reto de gamificación */}
        <div className={`rounded-xl p-2.5 border ${colorToken.border} ${colorToken.bg} flex items-center gap-2`}>
          <Target className={`w-3.5 h-3.5 ${colorToken.accent} shrink-0`} />
          <p className={`text-xs ${colorToken.accent} leading-tight`}>
            {cat.gamificacion.descripcion_reto}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE: Semáforo Global de Salud Financiera
// ============================================================
const SemaforoGlobal = ({ score, streak, xp }) => {
  const estado = score >= 70 ? "saludable" : score >= 40 ? "advertencia" : "critico";
  const token = TOKEN[estado];

  const etiqueta = {
    saludable: "Tu negocio está sano",
    advertencia: "Hay áreas de oportunidad",
    critico: "Tu negocio necesita atención",
  }[estado];

  const iconoEstado = {
    saludable: <TrendingUp className="w-6 h-6" />,
    advertencia: <AlertCircle className="w-6 h-6" />,
    critico: <TrendingDown className="w-6 h-6" />,
  }[estado];

  // Gauge SVG
  const angulo = (score / 100) * 180 - 90;
  const rad = (a) => (a * Math.PI) / 180;
  const cx = 80, cy = 80, r = 60;
  const startX = cx + r * Math.cos(rad(-180));
  const startY = cy + r * Math.sin(rad(-180));
  const endX = cx + r * Math.cos(rad(angulo - 90));
  const endY = cy + r * Math.sin(rad(angulo - 90));
  const largeArc = score > 50 ? 1 : 0;

  return (
    <div className={`card bg-base-100 shadow-xl border-2 ${
      estado === "saludable" ? "border-success/30" :
      estado === "advertencia" ? "border-warning/30" : "border-error/40"
    } col-span-full`}>
      <div className="card-body p-5">
        <div className="flex flex-col sm:flex-row items-center gap-5">

          {/* Gauge */}
          <div className="relative shrink-0">
            <svg width="160" height="90" viewBox="0 0 160 100">
              {/* Track */}
              <path
                d={`M ${20} ${80} A 60 60 0 0 1 ${140} ${80}`}
                fill="none" stroke="currentColor" strokeWidth="10"
                className="text-base-300" strokeLinecap="round"
              />
              {/* Fill */}
              <path
                d={`M ${20} ${80} A 60 60 0 ${largeArc} 1 ${endX} ${endY}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                className={`${
                  estado === "saludable" ? "text-success" :
                  estado === "advertencia" ? "text-warning" : "text-error"
                } transition-all duration-1000`}
              />
              {/* Score text */}
              <text x="80" y="78" textAnchor="middle" className="fill-base-content" fontSize="22" fontWeight="700">
                {score}
              </text>
              <text x="80" y="92" textAnchor="middle" className="fill-base-content/40" fontSize="9">
                /100
              </text>
            </svg>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className={`inline-flex items-center gap-2 ${token.badge} mb-2`}>
              {iconoEstado}
              <span className="font-semibold">{etiqueta}</span>
            </div>
            <p className="text-sm text-base-content/60 mb-3">
              Tu salud financiera se calcula con base en el control de tus tres categorías de gasto.
            </p>

            {/* Stats rápidas */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-1.5">
                <Flame className="w-4 h-4 text-warning" />
                <div>
                  <p className="text-xs text-base-content/50 leading-none">Racha</p>
                  <p className="font-bold text-sm text-base-content leading-tight">{streak} días</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-1.5">
                <Star className="w-4 h-4 text-accent" />
                <div>
                  <p className="text-xs text-base-content/50 leading-none">Puntos XP</p>
                  <p className="font-bold text-sm text-base-content leading-tight">{xp} XP</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-1.5">
                <Award className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-base-content/50 leading-none">Meta racha</p>
                  <p className="font-bold text-sm text-base-content leading-tight">5 días</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de racha */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <p className="text-xs text-base-content/40 uppercase tracking-widest">Racha semanal</p>
            <div className="flex gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i < streak
                      ? "bg-warning text-warning-content scale-110"
                      : "bg-base-300 text-base-content/20"
                  }`}
                >
                  {i < streak ? "✓" : i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-warning font-medium">
              {5 - streak > 0 ? `${5 - streak} días para tu badge 🏅` : "¡Badge desbloqueado! 🎉"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE: Resumen de ingresos del mes
// ============================================================
const ResumenIngresos = ({ ingresos, totalGastos }) => {
  const pct = calcPct(totalGastos, ingresos);
  const saldo = ingresos - totalGastos;
  return (
    <div className="card bg-primary text-primary-content shadow-xl">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-primary-content/70 text-xs uppercase tracking-widest mb-1">Ingresos del mes</p>
            <p className="text-3xl font-bold tabular-nums">${ingresos.toLocaleString("es-MX")}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-content/70 text-xs uppercase tracking-widest mb-1">Saldo disponible</p>
            <p className={`text-2xl font-bold tabular-nums ${saldo < 0 ? "text-error" : ""}`}>
              ${saldo.toLocaleString("es-MX")}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-primary-content/60 mb-1">
            <span>Total gastado: ${totalGastos.toLocaleString("es-MX")}</span>
            <span>{pct}% del ingreso</span>
          </div>
          <div className="w-full bg-primary-content/20 rounded-full h-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct > 90 ? "bg-error" : pct > 70 ? "bg-warning" : "bg-success"
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// APP ROOT — ColmenaSaludFinanciera
// ============================================================
export default function ColmenaSaludFinanciera() {
  const [estado, setEstado] = useState(ESTADO_INICIAL);

  const totalGastos = Object.values(estado.gastos_actuales).reduce((a, b) => a + b, 0);
  const score = getSemaforoScore(estado.gastos_actuales, estado.presupuestos, estado.ingresos_mes);

  const handleAgregarGasto = (catId, monto) => {
    setEstado((prev) => ({
      ...prev,
      gastos_actuales: {
        ...prev.gastos_actuales,
        [catId]: (prev.gastos_actuales[catId] || 0) + monto,
      },
    }));
  };

  return (
    // app-bg = "bg-base-200" según design.md
    <div className="bg-base-200 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-base-100 border-b border-base-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-content font-black text-sm">C</span>
            </div>
            <div>
              <p className="font-bold text-base-content text-sm leading-none">Colmena</p>
              <p className="text-xs text-base-content/40">Salud Financiera</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="badge badge-warning gap-1 text-xs">
              <Flame className="w-3 h-3" />
              {estado.streak_dias} días
            </div>
            <div className="badge badge-ghost gap-1 text-xs">
              <Star className="w-3 h-3 text-accent" />
              {estado.xp_total} XP
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">

        {/* Resumen ingresos */}
        <ResumenIngresos ingresos={estado.ingresos_mes} totalGastos={totalGastos} />

        {/* Semáforo global */}
        <SemaforoGlobal score={score} streak={estado.streak_dias} xp={estado.xp_total} />

        {/* Título sección */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base-content font-bold text-sm uppercase tracking-widest opacity-60">
            Categorías de Gasto
          </h2>
          <div className="flex items-center gap-1 text-xs text-base-content/40">
            <Clock className="w-3 h-3" />
            Mayo 2026
          </div>
        </div>

        {/* Tarjetas de categoría */}
        {COLMENA_DATA.categorias.map((cat) => (
          <TarjetaCategoria
            key={cat.id}
            cat={cat}
            gastoActual={estado.gastos_actuales[cat.id] || 0}
            presupuesto={estado.presupuestos[cat.id] || 0}
            ingresos={estado.ingresos_mes}
            onAgregarGasto={handleAgregarGasto}
          />
        ))}

        {/* Footer */}
        <p className="text-center text-xs text-base-content/30 py-2">
          Colmena · Módulo de Salud Financiera · Fase 3 Etapa 2
        </p>
      </main>
    </div>
  );
}
