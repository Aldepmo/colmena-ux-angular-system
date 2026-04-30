---
# =============================================================
# DESIGN SYSTEM: DAISYUI NATIVE STANDARD
# =============================================================
framework: DaisyUI
theme_engine: Tailwind_v4
# 1. CAPA DE PRIMITIVOS (Identidad Colmena / Ágora)
primitives:
  primary: "#D4AF37"          # Oro/Miel (Elegancia y comunidad)
  secondary: "#1A2E35"        # Azul Petróleo profundo (Raíces corporativas NY)
  accent: "#FFD700"           # Amarillo Brillante (Energía/Acción)
  neutral: "#4A4A4A"          # Gris Carbón (Estabilidad)[cite: 1]
  base-100: "#F9F7F2"         # Blanco Hueso/Crema (Papel premium)
  base-200: "#EFEBE0"         # Fondo suave

# 2. CAPA SEMÁNTICA (Mapeo de 36 Tokens a Clases DaisyUI)
# Aquí es donde Cursor sabe qué clase aplicar según el propósito.
tokens:
  actions:
    primary: "btn btn-primary"        # Botón principal
    secondary: "btn btn-secondary"    # Botón secundario
    accent: "btn btn-accent"          # Botón de acento
    outline: "btn btn-outline"        # Botón con borde
    ghost: "btn btn-ghost"            # Botón invisible/discreto
    disabled: "btn-disabled"          # Estado desactivado

  surfaces:
    main: "bg-base-200"               # Fondo general de la app
    card: "card bg-base-100 shadow-xl" # Tarjeta estándar
    card-body: "card-body"            # Contenedor interno de tarjeta
    container: "container mx-auto"    # Contenedor centrado
    modal: "modal-box"                # Caja de diálogo modal

  feedback:
    success: "alert alert-success"    # Alerta de éxito
    error: "alert alert-error"        # Alerta de error
    warning: "alert alert-warning"    # Alerta de advertencia
    info: "alert alert-info"          # Alerta de información

# (Sigue con los 36 tokens mapeados a clases de DaisyUI)
---

# ESTRUCTURA GLOBAL Y NORMAS DE DISEÑO

## 1. Reglas de Oro
- **Consistencia Estricta**: No se permiten estilos fuera de DaisyUI.
- **Puerto de Salida**: El dashboard principal siempre corre en Streamlit (puerto 8501).
- **Sincronización**: Todo cambio visual debe ser compatible con el plugin `html.to.design` para retornar a Figma.

## 2. Instrucciones para la IA (Cursor/Claude)
- Al crear componentes, prioriza siempre las clases semánticas de `@design.md`.
- Revisa siempre los "Problemas de Terminal" (Linter) antes de dar por terminada una tarea.

## 3. Notas de Despliegue (Botón de Pánico para Entrevista)
- Para levantar el dashboard: `streamlit run Dashboard-Streamlit/app.py`.
- Para visualizar prototipos HTML: Usar la extensión `Live Server` (puerto 5500).