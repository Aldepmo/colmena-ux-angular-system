import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { COLMENA_DATA, ESTADO_INICIAL, type Categoria, type EstadoFinanciero } from '../models/colmena-data';
import { TarjetaCategoriaComponent } from '../components/tarjeta-categoria.component';

type EstadoAlerta = 'saludable' | 'advertencia' | 'critico';

@Component({
  selector: 'app-salud-financiera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TarjetaCategoriaComponent],
  template: `
    <div class="bg-base-200 min-h-screen font-sans">
      <header class="bg-base-100 border-b border-base-300 shadow-sm">
        <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span class="text-primary-content font-black text-sm">C</span>
            </div>
            <div>
              <p class="font-bold text-base-content text-sm leading-none">Colmena</p>
              <p class="text-xs text-base-content/40">Salud Financiera</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="badge badge-warning badge-sm gap-0.5 text-[10px] py-1">
              <span class="text-[10px]">🔥</span>
              {{ estado().streak_dias }}
            </div>
            <div class="badge badge-ghost badge-sm gap-0.5 text-[10px] py-1">
              <span class="text-[10px]">⭐</span>
              {{ estado().xp_total }}
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">
        @if (resumenIngresos()) {
          <div class="card bg-primary text-primary-content shadow-xl">
            <div class="card-body p-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-primary-content/70 text-xs uppercase tracking-widest mb-1">Ingresos del mes</p>
                  <p class="text-3xl font-bold tabular-nums">\${{ estado().ingresos_mes | number:'1.0-0' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-primary-content/70 text-xs uppercase tracking-widest mb-1">Saldo disponible</p>
                  <p class="text-2xl font-bold tabular-nums" [class]="saldoDisponible() < 0 ? 'text-error' : ''">
                    \${{ saldoDisponible() | number:'1.0-0' }}
                  </p>
                </div>
              </div>
              <div class="mt-3">
                <div class="flex justify-between text-xs text-primary-content/60 mb-1">
                  <span>Total gastado: \${{ totalGastos() | number:'1.0-0' }}</span>
                  <span>{{ pctGastosDelIngreso() }}% del ingreso</span>
                </div>
                <div class="w-full bg-primary-content/20 rounded-full h-2">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    [class]="getBarColorClass(pctGastosDelIngreso())"
                    [style.width.%]="Math.min(pctGastosDelIngreso(), 100)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        }

        @if (semaforoGlobal()) {
          <div class="card bg-base-100 shadow-xl border-2" [class]="getSemaforoBorderClass(semaforoGlobal()!.estado)">
            <div class="card-body p-5">
              <div class="flex flex-col sm:flex-row items-center gap-5">
                <div class="relative shrink-0">
                  <svg width="160" height="90" viewBox="0 0 160 100">
                    <path
                      d="M 20 80 A 60 60 0 0 1 140 80"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="10"
                      class="text-base-300"
                      stroke-linecap="round"
                    />
                    <path
                      [attr.d]="getGaugePath(semaforoGlobal()!.score)"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="10"
                      stroke-linecap="round"
                      [class]="getSemaforoColorClass(semaforoGlobal()!.estado)"
                      style="transition: all 1s"
                    />
                    <text x="80" y="78" text-anchor="middle" class="fill-base-content" font-size="22" font-weight="700">
                      {{ semaforoGlobal()!.score }}
                    </text>
                    <text x="80" y="92" text-anchor="middle" class="fill-base-content/40" font-size="9">
                      /100
                    </text>
                  </svg>
                </div>

<div class="flex-1 text-center sm:text-left">
                  <div [class]="'inline-flex max-w-full items-center gap-2 mb-2 rounded-xl px-3 py-2 h-auto whitespace-normal leading-tight text-center sm:text-left ' + getSemaforoBadgeClass(semaforoGlobal()!.estado)">
                    <span>{{ getSemaforoIcon(semaforoGlobal()!.estado) }}</span>
                    <span class="font-semibold">{{ semaforoGlobal()!.label }}</span>
                  </div>
                  <p class="text-sm text-base-content/60 mb-3">
                    Tu salud financiera se calcula con base en el control de tus tres categorías de gasto.
                  </p>
                </div>

                <div class="shrink-0 flex flex-col items-center gap-2">
                  <p class="text-xs text-base-content/40 uppercase tracking-widest">Racha semanal</p>
                  <div class="flex gap-1.5">
                    @for (day of [1,2,3,4,5,6,7]; track day) {
                      <div
                        class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300"
                        [class]="day <= estado().streak_dias 
                          ? 'bg-warning text-warning-content scale-110' 
                          : 'bg-base-300 text-base-content/20'"
                      >
                        {{ day <= estado().streak_dias ? '✓' : day }}
                      </div>
                    }
                  </div>
                  <p class="text-xs text-warning font-medium">
                    {{ 5 - estado().streak_dias > 0 ? (5 - estado().streak_dias) + ' días para tu insignia' : '¡Insignia desbloqueada! 🎉' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        }

        <div class="flex items-center justify-between px-1">
          <h2 class="text-base-content font-bold text-sm uppercase tracking-widest opacity-60">
            Categorías de Gasto
          </h2>
          <div class="flex items-center gap-1 text-xs text-base-content/40">
            <span>🕐</span>
            Mayo 2026
          </div>
        </div>

        @for (cat of COLMENA_DATA.categorias; track cat.id) {
          <app-tarjeta-categoria
            [categoria]="cat"
            [gastoActual]="estado().gastos_actuales[cat.id] || 0"
            [presupuesto]="estado().presupuestos[cat.id] || 0"
            [ingresos]="estado().ingresos_mes"
            (agregarGasto)="onAgregarGasto($event, cat)"
          />
        }

        <p class="text-center text-xs text-base-content/30 py-2">
          Colmena · Módulo de Salud Financiera · Fase 3
        </p>
      </main>
    </div>
  `
})
export class SaludFinancieraComponent {
  COLMENA_DATA = COLMENA_DATA;
  ESTADO_INICIAL = ESTADO_INICIAL;
  Math = Math;

  estado = signal<EstadoFinanciero>({ ...ESTADO_INICIAL });

  totalGastos = computed(() => {
    const gastos = this.estado().gastos_actuales;
    return (gastos['cat_operativos'] || 0) + (gastos['cat_fijos'] || 0) + (gastos['cat_hormiga'] || 0);
  });

  saldoDisponible = computed(() => this.estado().ingresos_mes - this.totalGastos());

  pctGastosDelIngreso = computed(() => {
    const pct = (this.totalGastos() / this.estado().ingresos_mes) * 100;
    return Math.round(pct);
  });

  resumenIngresos = computed(() => true);
  semaforoGlobal = computed(() => this.calcularSemaforo());

  calcularSemaforo() {
    const gastos = this.estado().gastos_actuales;
    const presupuestos = this.estado().presupuestos;
    const ingreso = this.estado().ingresos_mes;

    const pctOp = this.calcPct(gastos['cat_operativos'] || 0, presupuestos['cat_operativos'] || 1);
    const pctFijo = this.calcPct(gastos['cat_fijos'] || 0, presupuestos['cat_fijos'] || 1);
    const pctHormiga = this.calcPct(gastos['cat_hormiga'] || 0, presupuestos['cat_hormiga'] || 1);
    const avgPct = (pctOp + pctFijo + pctHormiga) / 3;
    const score = Math.max(0, Math.round(100 - avgPct * 0.8));

    let estado: EstadoAlerta = 'saludable';
    let label = 'Tu negocio está sano';
    if (score < 40) {
      estado = 'critico';
      label = 'Tu negocio necesita atención';
    } else if (score < 70) {
      estado = 'advertencia';
      label = 'Hay áreas de oportunidad';
    }

    return { score, estado, label };
  }

  calcPct(gasto: number, limite: number): number {
    return limite > 0 ? Math.min(Math.round((gasto / limite) * 100), 120) : 0;
  }

  onAgregarGasto(monto: number, cat: Categoria) {
    this.estado.update(prev => ({
      ...prev,
      gastos_actuales: {
        ...prev.gastos_actuales,
        [cat.id]: (prev.gastos_actuales[cat.id] || 0) + monto
      }
    }));
  }

  getBarColorClass(pct: number): string {
    if (pct > 90) return 'bg-error';
    if (pct > 70) return 'bg-warning';
    return 'bg-success';
  }

  getSemaforoBorderClass(estado: EstadoAlerta): string {
    if (estado === 'saludable') return 'border-success/30';
    if (estado === 'advertencia') return 'border-warning/30';
    return 'border-error/40';
  }

  getSemaforoColorClass(estado: EstadoAlerta): string {
    if (estado === 'saludable') return 'text-success';
    if (estado === 'advertencia') return 'text-warning';
    return 'text-error';
  }

  getSemaforoBadgeClass(estado: EstadoAlerta): string {
    if (estado === 'saludable') return 'bg-success/15 text-success';
    if (estado === 'advertencia') return 'bg-warning/15 text-warning';
    return 'bg-error/15 text-error';
  }

  getSemaforoIcon(estado: EstadoAlerta): string {
    if (estado === 'saludable') return '📈';
    if (estado === 'advertencia') return '⚠️';
    return '🚨';
  }

  getGaugePath(score: number): string {
    const angulo = (score / 100) * 180 - 90;
    const rad = (a: number) => (a * Math.PI) / 180;
    const cx = 80, cy = 80, r = 60;
    const endX = cx + r * Math.cos(rad(angulo - 90));
    const endY = cy + r * Math.sin(rad(angulo - 90));
    const largeArc = score > 50 ? 1 : 0;
    return `M 20 80 A 60 60 0 ${largeArc} 1 ${endX} ${endY}`;
  }
}