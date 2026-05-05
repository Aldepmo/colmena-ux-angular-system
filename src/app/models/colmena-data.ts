export interface ConfigGlobal {
  periodo_activo: string;
  moneda: string;
  dias_habiles_mes: number;
  meta_registro_consecutivo: number;
  umbral_salud_verde: number;
  umbral_salud_amarillo: number;
}

export interface TipoAlerta {
  nivel_advertencia: 'warning' | 'info';
  nivel_critico: 'error' | 'warning';
  umbral_advertencia_pct: number;
  umbral_critico_pct: number;
  mensaje_advertencia: string;
  mensaje_critico: string;
  persistencia_alerta?: boolean;
  requiere_confirmacion_lectura?: boolean;
}

export interface Gamificacion {
  mini_reto_id: string;
  condicion_logro: string;
  dias_requeridos: number;
  recompensa_badge: string;
  descripcion_reto: string;
}

export interface Subcategoria {
  id: string;
  nombre: string;
  descripcion?: string;
  icono: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color_token: 'primary' | 'secondary' | 'accent';
  tipo: 'variable' | 'fijo' | 'fuga';
  es_categoria_critica?: boolean;
  limite_sugerido: { tipo: string; valor: number | null };
  tipo_alerta: TipoAlerta;
  gamificacion: Gamificacion;
  subcategorias: Subcategoria[];
}

export interface GamificacionEstado {
  registro_consecutivo_dias: number;
  xp_total: number;
  nivel_actual: number;
  badges_obtenidos: string[];
}

export interface ColmenaData {
  config_global: ConfigGlobal;
  categorias: Categoria[];
  gamificacion: {
    estado_usuaria: GamificacionEstado;
    reglas_streak: Record<string, { dias: number; mensaje: string; badge?: string }>;
  };
}

export interface EstadoFinanciero {
  ingresos_mes: number;
  presupuestos: Record<string, number>;
  gastos_actuales: Record<string, number>;
  streak_dias: number;
  xp_total: number;
}

export const COLMENA_DATA: ColmenaData = {
  config_global: {
    periodo_activo: 'mensual',
    moneda: 'MXN',
    dias_habiles_mes: 22,
    meta_registro_consecutivo: 5,
    umbral_salud_verde: 70,
    umbral_salud_amarillo: 40,
  },
  categorias: [
    {
      id: 'cat_operativos',
      nombre: 'Gastos Operativos',
      descripcion: 'Lo que gastas para que tu negocio funcione cada día',
      icono: 'briefcase',
      color_token: 'primary',
      tipo: 'variable',
      limite_sugerido: { tipo: 'porcentaje_de_ingresos', valor: 40 },
      tipo_alerta: {
        nivel_advertencia: 'warning',
        nivel_critico: 'error',
        umbral_advertencia_pct: 80,
        umbral_critico_pct: 100,
        mensaje_advertencia: 'Llevas el {pct}% de tu presupuesto operativo',
        mensaje_critico: '¡Superaste tu límite operativo este mes!',
      },
      gamificacion: {
        mini_reto_id: 'reto_operativos_control',
        condicion_logro: 'mantener_bajo_limite_dias',
        dias_requeridos: 7,
        recompensa_badge: 'badge_control_operativo',
        descripcion_reto: 'Mantén tus gastos operativos bajo control por 7 días',
      },
      subcategorias: [
        { id: 'sub_materia_prima', nombre: 'Materia Prima', icono: 'package' },
        { id: 'sub_servicios_negocio', nombre: 'Servicios del Negocio', icono: 'zap' },
        { id: 'sub_transporte', nombre: 'Transporte y Logística', icono: 'truck' },
      ],
    },
    {
      id: 'cat_fijos',
      nombre: 'Gastos Fijos',
      descripcion: 'Lo que pagas aunque no vendas nada',
      icono: 'home',
      color_token: 'secondary',
      tipo: 'fijo',
      limite_sugerido: { tipo: 'monto_fijo_mensual', valor: null },
      tipo_alerta: {
        nivel_advertencia: 'info',
        nivel_critico: 'warning',
        umbral_advertencia_pct: 90,
        umbral_critico_pct: 100,
        mensaje_advertencia: 'Ya comprometiste el {pct}% de tu presupuesto fijo',
        mensaje_critico: 'Tus gastos fijos superaron el presupuesto.',
      },
      gamificacion: {
        mini_reto_id: 'reto_fijos_registro',
        condicion_logro: 'registro_puntual_inicio_mes',
        dias_requeridos: 3,
        recompensa_badge: 'badge_negocio_ordenado',
        descripcion_reto: 'Registra todos tus gastos fijos antes del día 3 del mes',
      },
      subcategorias: [
        { id: 'sub_renta', nombre: 'Renta', icono: 'map-pin' },
        { id: 'sub_conectividad', nombre: 'Conectividad', icono: 'wifi' },
        { id: 'sub_sueldos', nombre: 'Sueldos y Auto-pago', icono: 'users' },
      ],
    },
    {
      id: 'cat_hormiga',
      nombre: 'Gastos Hormiga',
      descripcion: "Los pequeños gastos que se 'comen' tu negocio sin que te des cuenta",
      icono: 'alert-triangle',
      color_token: 'accent',
      tipo: 'fuga',
      es_categoria_critica: true,
      limite_sugerido: { tipo: 'monto_fijo_mensual', valor: null },
      tipo_alerta: {
        nivel_advertencia: 'warning',
        nivel_critico: 'error',
        umbral_advertencia_pct: 70,
        umbral_critico_pct: 100,
        persistencia_alerta: true,
        requiere_confirmacion_lectura: true,
        mensaje_advertencia: '¡Ojo! Llevas ${monto} en gastos personales esta semana',
        mensaje_critico: 'Tu negocio está financiando gastos del hogar. Hablemos de eso 👀',
      },
      gamificacion: {
        mini_reto_id: 'reto_hormiga_conciencia',
        condicion_logro: 'registro_consecutivo_dias',
        dias_requeridos: 5,
        recompensa_badge: 'badge_separacion_financiera',
        descripcion_reto: 'Registra tus gastos personales 5 días seguidos',
      },
      subcategorias: [
        { id: 'sub_antojos', nombre: 'Antojos y Gastos del Día', icono: 'coffee' },
        { id: 'sub_familiares', nombre: 'Gastos Familiares', icono: 'heart' },
      ],
    },
  ],
  gamificacion: {
    estado_usuaria: {
      registro_consecutivo_dias: 3,
      xp_total: 120,
      nivel_actual: 2,
      badges_obtenidos: ['badge_primer_registro'],
    },
    reglas_streak: {
      hito_2: { dias: 5, mensaje: '¡Una semana de hábito! Eres imparable' },
    },
  },
};

export const ESTADO_INICIAL: EstadoFinanciero = {
  ingresos_mes: 18000,
  presupuestos: {
    cat_operativos: 7200,
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