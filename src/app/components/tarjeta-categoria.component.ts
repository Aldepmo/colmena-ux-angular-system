import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { type Categoria } from '../models/colmena-data';
import { BadgeComponent } from './atoms/badge.component';
import { ProgressBarComponent } from './atoms/progress-bar.component';
import { ButtonComponent } from './atoms/button.component';
import { InputComponent } from './atoms/input.component';

type EstadoAlerta = 'saludable' | 'advertencia' | 'critico';

@Component({
  selector: 'app-tarjeta-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent, ProgressBarComponent],
  template: `
    <section
      class="card bg-base-100 shadow-xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5"
      [class]="getBorderClass()"
      role="region"
      [attr.aria-labelledby]="'categoria-titulo-' + categoria.id"
    >
      <div class="card-body p-4 gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div [class]="'p-2 rounded-xl ' + getColorToken().bg">
              <span [class]="'text-lg ' + getColorToken().accent">{{ getIcono() }}</span>
            </div>
            <div>
              <h3 [attr.id]="'categoria-titulo-' + categoria.id" class="font-semibold text-base-content text-sm leading-tight">{{ categoria.nombre }}</h3>
              <p class="text-xs text-base-content/70 leading-tight mt-0.5">{{ categoria.descripcion }}</p>
            </div>
          </div>
          <div
            [class]="'insignia shrink-0 ' + getSemaforoBadgeClass()"
            role="status"
            [attr.aria-live]="getEstado() === 'critico' ? 'assertive' : 'polite'"
            [attr.aria-label]="'Estado de ' + categoria.nombre + ': ' + getEstadoLabel() + ', ' + pct() + ' por ciento'"
          >
            {{ getEstado() === 'saludable' ? '✓' : getEstado() === 'advertencia' ? '⚠' : '🚨' }}
            {{ pct() }}%
          </div>
        </div>

        <div class="flex items-end justify-between">
          <div>
            <span [class]="'text-2xl font-bold tabular-nums leading-none ' + getSemaforoTextClass()">
              \${{ gastoActual | number:'1.0-0' }}
            </span>
            <span class="text-xs text-base-content/70 font-medium ml-1">gastado</span>
          </div>
          <div class="text-right">
            <p class="text-xs text-base-content/70 font-medium">de \${{ presupuesto | number:'1.0-0' }}</p>
            @if (faltante() > 0) {
              <p class="text-xs text-success font-medium">+\${{ faltante() | number:'1.0-0' }} disponible</p>
            } @else {
              <p class="text-xs text-error font-medium animate-pulse">-\${{ excedente() | number:'1.0-0' }} excedido</p>
            }
          </div>
        </div>

        <div
          class="w-full bg-base-300 rounded-full h-2.5 overflow-hidden"
          role="progressbar"
          [attr.aria-label]="'Uso del presupuesto de ' + categoria.nombre"
          [attr.aria-valuenow]="Math.min(pct(), 100)"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            [class]="getBarColorClass()"
            [style.width.%]="Math.min(pct(), 100)"
            [class.animate-pulse]="getEstado() === 'critico'"
          ></div>
        </div>

        @if (getEstado() !== 'saludable') {
          <div
            [class]="'py-2 px-3 rounded-xl mt-2 flex items-start gap-2 text-sm ' + getAlertaClass()"
            [attr.role]="getEstado() === 'critico' ? 'alert' : 'status'"
            [attr.aria-live]="getEstado() === 'critico' ? 'assertive' : 'polite'"
            aria-atomic="true"
          >
            <span>{{ getAlertaIcon() }}</span>
            <span class="flex-1 leading-tight">{{ getAlertaMensaje() }}</span>
            @if (!categoria.tipo_alerta.persistencia_alerta) {
              <button
                type="button"
                (click)="dismissAlerta.set(true)"
                [attr.aria-label]="'Cerrar alerta de ' + categoria.nombre"
                class="btn btn-ghost btn-xs p-0 min-h-0 h-auto opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                ✕
              </button>
            }
            @if (categoria.tipo_alerta.persistencia_alerta && categoria.tipo_alerta.requiere_confirmacion_lectura) {
              <span class="insignia bg-base-200 border-base-300 text-base-content/70">⚠ Requiere revisión</span>
            }
          </div>
        }

        <div class="flex gap-2 mt-3 flex-wrap sm:flex-nowrap">
          <div class="join flex-1 min-w-0">
            <span aria-hidden="true" class="join-item flex items-center px-2 sm:px-3 bg-base-200 text-base-content/70 text-xs sm:text-sm border border-base-300 rounded-l-xl shrink-0">
              $
            </span>
            <input
              type="number"
              [(ngModel)]="montoInput"
              (keydown.enter)="agregar()"
              placeholder="0.00"
              [attr.aria-label]="'Monto a agregar en ' + categoria.nombre"
              inputmode="decimal"
              min="0"
              class="input input-bordered input-sm flex-1 join-item text-xs sm:text-sm min-w-0"
            />
          </div>
          <button
            type="button"
            (click)="agregar()"
            [attr.aria-label]="'Agregar gasto en ' + categoria.nombre"
            class="btn btn-primary btn-sm gap-1 rounded-xl shrink-0"
          >
            <span>+</span>
            Agregar
          </button>
        </div>

        <button
          type="button"
          (click)="expandido.set(!expandido())"
          [attr.aria-expanded]="expandido()"
          [attr.aria-controls]="'subcategorias-' + categoria.id"
          [attr.aria-label]="(expandido() ? 'Ocultar' : 'Mostrar') + ' subcategorías de ' + categoria.nombre"
          class="flex items-center gap-1 text-xs text-base-content/60 font-medium hover:text-base-content/90 transition-colors w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md px-1 py-0.5"
        >
          <span aria-hidden="true" [class]="expandido() ? 'rotate-90' : ''" class="transition-transform">▶</span>
          {{ categoria.subcategorias.length }} subcategorías
        </button>

        @if (expandido()) {
          <div [attr.id]="'subcategorias-' + categoria.id" class="flex flex-wrap gap-2 pt-1" role="list" [attr.aria-label]="'Subcategorías de ' + categoria.nombre">
            @for (sub of categoria.subcategorias; track sub.id) {
              <button
                type="button"
                role="listitem"
                [attr.aria-label]="'Seleccionar subcategoría: ' + sub.nombre"
                [class]="'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold leading-tight cursor-pointer transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' + getColorToken().border + ' ' + getColorToken().bg + ' text-base-content hover:shadow-md'"
              >
                <span aria-hidden="true">{{ getSubIcono(sub.icono) }}</span>
                <span>{{ sub.nombre }}</span>
              </button>
            }
          </div>
        }

        <div [class]="'rounded-xl p-2.5 border flex items-center gap-2 ' + getColorToken().border + ' ' + getColorToken().bg">
          <span [class]="'text-sm ' + getColorToken().accent">🎯</span>
          <p class="text-sm font-medium text-base-content leading-tight">
            {{ categoria.gamificacion.descripcion_reto }}
          </p>
        </div>
      </div>
    </section>
  `
})
export class TarjetaCategoriaComponent {
  @Input({ required: true }) categoria!: Categoria;
  @Input() gastoActual = 0;
  @Input() presupuesto = 0;
  @Input() ingresos = 0;
  @Output() agregarGasto = new EventEmitter<number>();

  montoInput: number | null = null;
  dismissAlerta = signal(false);
  expandido = signal(false);
  Math = Math;

  pct(): number {
    return this.presupuesto > 0 
      ? Math.min(Math.round((this.gastoActual / this.presupuesto) * 100), 120) 
      : 0;
  }

  getEstado(): EstadoAlerta {
    const pct = this.pct();
    if (pct >= this.categoria.tipo_alerta.umbral_critico_pct) return 'critico';
    if (pct >= this.categoria.tipo_alerta.umbral_advertencia_pct) return 'advertencia';
    return 'saludable';
  }

  faltante(): number {
    return Math.max(this.presupuesto - this.gastoActual, 0);
  }

  excedente(): number {
    return Math.max(this.gastoActual - this.presupuesto, 0);
  }

  getColorToken() {
    const tokens: Record<string, { accent: string; border: string; bg: string }> = {
      primary: { accent: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/10' },
      secondary: { accent: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/10' },
      accent: { accent: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/10' },
    };
    return tokens[this.categoria.color_token] || tokens['primary'];
  }

  getBorderClass(): string {
    const estado = this.getEstado();
    if (estado === 'critico') return 'border-error/40 shadow-error/20';
    if (estado === 'advertencia') return 'border-warning/30';
    return 'border-base-200';
  }

  getSemaforoBadgeClass(): string {
    const estado = this.getEstado();
    if (estado === 'critico') return 'insignia-critico';
    if (estado === 'advertencia') return 'insignia-advertencia';
    return 'insignia-saludable';
  }

  getEstadoLabel(): string {
    const estado = this.getEstado();
    if (estado === 'critico') return 'crítico';
    if (estado === 'advertencia') return 'advertencia';
    return 'saludable';
  }

  getSemaforoTextClass(): string {
    const estado = this.getEstado();
    if (estado === 'critico') return 'text-error';
    if (estado === 'advertencia') return 'text-warning';
    return 'text-success';
  }

  getBarColorClass(): string {
    const estado = this.getEstado();
    if (estado === 'critico') return 'bg-error';
    if (estado === 'advertencia') return 'bg-warning';
    return 'bg-success';
  }

  getAlertaClass(): string {
    const estado = this.getEstado();
    return estado === 'critico' ? 'alert alert-error' : 'alert alert-warning';
  }

  getAlertaIcon(): string {
    return this.getEstado() === 'critico' ? '🚨' : '⚠️';
  }

  getAlertaMensaje(): string {
    const estado = this.getEstado();
    const pct = this.pct();
    const excedente = this.excedente();
    if (estado === 'critico') {
      return this.categoria.tipo_alerta.mensaje_critico;
    }
    let msg = this.categoria.tipo_alerta.mensaje_advertencia;
    msg = msg.replace('{pct}', pct.toString());
    msg = msg.replace('{monto}', excedente.toString());
    return msg;
  }

  getIcono(): string {
    const icons: Record<string, string> = {
      briefcase: '💼', home: '🏠', 'alert-triangle': '⚠️',
      package: '📦', zap: '⚡', truck: '🚚',
      'map-pin': '📍', wifi: '📶', users: '👥',
      coffee: '☕', heart: '❤️',
    };
    return icons[this.categoria.icono] || '📊';
  }

  getSubIcono(icono: string): string {
    return this.getIcono();
  }

  agregar() {
    if (this.montoInput && this.montoInput > 0) {
      this.agregarGasto.emit(this.montoInput);
      this.montoInput = null;
    }
  }
}