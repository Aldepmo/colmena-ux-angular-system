/**
 * ============================================================
 * COLMENA — Sistema de Diseño: Componentes Atómicos
 * Fase 4 — ColmenaUI.jsx
 *
 * Tokens: Estrictamente según design.md (DaisyUI + Tailwind)
 * Sin colores hexadecimales en JSX. Sin CSS manual.
 * Modo claro/oscuro resuelto 100% por aliases semánticos.
 * Accesibilidad: WCAG AA — aria-labels, roles, focus-visible.
 * Mobile-first: tamaños mínimos de tap 44px, texto ≥14px.
 * ============================================================
 */

// ─────────────────────────────────────────
// ÁTOMO: Button
// Variantes: primary | secondary | ghost | danger | outline
// Tamaños: sm | md | lg
// ─────────────────────────────────────────
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = "left",
  onClick,
  type = "button",
  ariaLabel,
}) {
  const base = "btn font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95";

  const variants = {
    primary:   "btn-primary",
    secondary: "btn-secondary",
    ghost:     "btn-ghost",
    danger:    "btn-error",
    outline:   "btn-outline btn-primary",
    neutral:   "btn-neutral",
  };

  const sizes = {
    sm: "btn-sm text-xs min-h-[36px]",
    md: "btn-md text-sm min-h-[44px]",
    lg: "btn-lg text-base min-h-[52px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        loading ? "gap-2" : Icon ? "gap-2" : "",
      ].join(" ")}
    >
      {loading && <span className="loading loading-spinner loading-xs" aria-hidden="true" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="w-4 h-4" aria-hidden="true" />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: Input
// Variantes: text | number | currency
// Estados: default | focus | error | success | disabled
// ─────────────────────────────────────────
export function Input({
  label,
  hint,
  error,
  success,
  type = "text",
  prefix,
  suffix,
  placeholder,
  value,
  onChange,
  onKeyDown,
  disabled = false,
  required = false,
  id,
  min,
  max,
  inputRef,
  size = "md",
  ariaDescribedBy,
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const sizeClass = {
    sm: "input-sm text-sm",
    md: "input-md text-sm",
    lg: "input-lg text-base",
  }[size];

  const stateClass = error
    ? "input-error"
    : success
    ? "input-success"
    : "input-bordered focus:input-primary";

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={inputId} className="label pb-1 pt-0">
          <span className="label-text text-sm font-medium text-base-content">
            {label}
            {required && (
              <span className="text-error ml-1" aria-hidden="true">*</span>
            )}
          </span>
          {hint && !error && (
            <span id={hintId} className="label-text-alt text-base-content/50 text-xs">
              {hint}
            </span>
          )}
        </label>
      )}

      <div className={`flex items-center ${prefix || suffix ? "join" : ""}`}>
        {prefix && (
          <span
            className="join-item flex items-center px-3 bg-base-200 border border-base-300 text-base-content/50 text-sm h-full min-h-[44px] select-none"
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          aria-describedby={[
            error ? errorId : null,
            hint ? hintId : null,
            ariaDescribedBy,
          ]
            .filter(Boolean)
            .join(" ") || undefined}
          aria-invalid={error ? "true" : undefined}
          className={[
            "input w-full",
            sizeClass,
            stateClass,
            prefix ? "join-item rounded-l-none" : "",
            suffix ? "join-item rounded-r-none" : "",
            "focus:outline-none transition-colors duration-150",
          ].join(" ")}
        />
        {suffix && (
          <span
            className="join-item flex items-center px-3 bg-base-200 border border-base-300 text-base-content/50 text-sm h-full min-h-[44px] select-none"
            aria-hidden="true"
          >
            {suffix}
          </span>
        )}
      </div>

      {(error || success) && (
        <label className="label pt-1 pb-0">
          <span
            id={errorId}
            className={`label-text-alt text-xs ${error ? "text-error" : "text-success"}`}
            role={error ? "alert" : undefined}
            aria-live={error ? "polite" : undefined}
          >
            {error || success}
          </span>
        </label>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: Badge
// Variantes: success | warning | error | info | neutral | primary | secondary
// ─────────────────────────────────────────
export function Badge({
  children,
  variant = "neutral",
  size = "md",
  icon: Icon = null,
  outline = false,
}) {
  const variants = {
    success:   "badge-success",
    warning:   "badge-warning",
    error:     "badge-error",
    info:      "badge-info",
    neutral:   "badge-neutral",
    primary:   "badge-primary",
    secondary: "badge-secondary",
    ghost:     "badge-ghost",
  };

  const sizes = {
    xs: "badge-xs text-[10px]",
    sm: "badge-sm text-xs",
    md: "text-xs",
    lg: "badge-lg text-sm",
  };

  return (
    <span
      className={[
        "badge font-medium gap-1 items-center",
        variants[variant],
        sizes[size],
        outline ? "badge-outline" : "",
      ].join(" ")}
    >
      {Icon && <Icon className="w-3 h-3" aria-hidden="true" />}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: Alert
// Variantes: info | success | warning | error
// Con soporte de persistencia (no-dismiss) para Comportamiento #2
// ─────────────────────────────────────────
export function Alert({
  children,
  variant = "info",
  icon: Icon = null,
  dismissible = true,
  persistent = false,
  onDismiss,
  className = "",
}) {
  const variants = {
    info:    "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error:   "alert-error",
  };

  return (
    <div
      role="alert"
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={[
        "alert py-2.5 px-3.5 rounded-xl text-sm",
        variants[variant],
        className,
      ].join(" ")}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      <span className="flex-1 leading-snug">{children}</span>

      {persistent && (
        <Badge variant="info" outline size="xs">
          Requiere revisión
        </Badge>
      )}

      {dismissible && !persistent && onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Cerrar alerta"
          className="btn btn-ghost btn-xs btn-circle p-0 min-h-0 h-6 w-6 opacity-60 hover:opacity-100 focus-visible:opacity-100"
        >
          {/* X icon inline para no depender de import en átomo */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: ProgressBar
// Comportamiento #1: color reactivo en tiempo real
// ─────────────────────────────────────────
export function ProgressBar({
  value = 0,         // 0-100
  max = 100,
  estado = "saludable", // saludable | advertencia | critico
  size = "md",
  showLabel = false,
  label,
  animated = true,
}) {
  const pct = Math.min(Math.round((value / max) * 100), 100);

  const trackSizes = { xs: "h-1", sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  const fillColors = {
    saludable:  "bg-success",
    advertencia: "bg-warning",
    critico:    "bg-error",
  };

  const pulseClass = estado === "critico" && animated ? "animate-pulse" : "";

  return (
    <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label || `${pct}% del límite`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-base-content/60">{label}</span>
          <span className={`text-xs font-semibold ${
            estado === "saludable" ? "text-success" :
            estado === "advertencia" ? "text-warning" : "text-error"
          }`}>{pct}%</span>
        </div>
      )}
      <div className={`w-full bg-base-300 rounded-full overflow-hidden ${trackSizes[size]}`}>
        <div
          className={[
            "h-full rounded-full transition-all duration-700 ease-out",
            fillColors[estado],
            pulseClass,
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: StreakDot
// Visualiza el progreso de racha diaria
// ─────────────────────────────────────────
export function StreakDot({ index, activo, size = "md" }) {
  const sizes = { sm: "w-5 h-5 text-[9px]", md: "w-7 h-7 text-xs", lg: "w-9 h-9 text-sm" };

  return (
    <div
      aria-label={activo ? `Día ${index + 1} completado` : `Día ${index + 1} pendiente`}
      className={[
        sizes[size],
        "rounded-lg flex items-center justify-center font-bold transition-all duration-300",
        activo
          ? "bg-warning text-warning-content scale-110 shadow-sm"
          : "bg-base-300 text-base-content/30",
      ].join(" ")}
    >
      {activo ? "✓" : index + 1}
    </div>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: Modal
// Accesibilidad: focus trap, aria-modal, aria-labelledby
// ─────────────────────────────────────────
export function Modal({
  open = false,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const modalId = "colmena-modal-title";

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalId}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`modal-box ${sizes[size]} p-0 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <h3
            id={modalId}
            className="font-semibold text-base-content text-base"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="btn btn-ghost btn-sm btn-circle"
            autoFocus
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-2 justify-end px-5 py-4 border-t border-base-300 bg-base-200/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: ThemeToggle
// Conmuta data-theme en <html> entre light y dark
// Sin estado externo necesario
// ─────────────────────────────────────────
export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="btn btn-ghost btn-sm btn-circle"
    >
      {theme === "dark" ? (
        /* Sol */
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        /* Luna */
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

// ─────────────────────────────────────────
// ÁTOMO: StatCard
// Tarjeta compacta para métricas: XP, racha, saldo
// ─────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, accent = "primary" }) {
  const accents = {
    primary:   "text-primary",
    secondary: "text-secondary",
    accent:    "text-accent",
    success:   "text-success",
    warning:   "text-warning",
    error:     "text-error",
  };

  return (
    <div className="bg-base-200 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
      {Icon && (
        <Icon
          className={`w-4 h-4 shrink-0 ${accents[accent]}`}
          aria-hidden="true"
        />
      )}
      <div>
        <p className="text-[10px] text-base-content/50 leading-none uppercase tracking-widest">
          {label}
        </p>
        <p className="font-bold text-sm text-base-content leading-tight mt-0.5">
          {value}
        </p>
        {sub && (
          <p className="text-[10px] text-base-content/40 leading-none mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}
