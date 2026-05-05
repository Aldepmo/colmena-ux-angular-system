import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { type Categoria } from '../models/colmena-data';

type EstadoAlerta = 'saludable' | 'advertencia' | 'critico';

@Component({
  selector: 'app-tarjeta-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="card bg-base-100 shadow-xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5"
      [class]="getBorderClass()"
    >
      <div class="card-body p-4 gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div [class]="'p-2 rounded-xl ' + getColorToken().bg">
              <span [class]="'text-lg ' + getColorToken().accent">{{ getIcono() }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-base-content text-sm leading-tight">{{ categoria.nombre }}</h3>
              <p class="text-xs text-base-content/50 leading-tight mt-0.5">{{ categoria.descripcion }}</p>
            </div>
          </div>

          <div [class]="'badge gap-1 shrink-0 text-xs ' + getSemaforoBadgeClass()">
            {{ getEstado() === 'saludable' ? '✓' : getEstado() === 'advertencia' ? '⚠' : '🚨' }}
            {{ pct() }}%
          </div>
        </div>

        <div class="flex items-end justify-between">
          <div>
            <span [class]="'text-2xl font-bold tabular-nums leading-none ' + getSemaforoTextClass()">
              \${{ gastoActual | number:'1.0-0' }}
            </span>
            <span class="text-xs text-base-content/40 ml-1">gastado</span>
          </div>
          <div class="text-right">
            <p class="text-xs text-base-content/40">de \${{ presupuesto | number:'1.0-0' }}</p>
            @if (faltante() > 0) {
              <p class="text-xs text-success font-medium">+\${{ faltante() | number:'1.0-0' }} disponible</p>
            } @else {
              <p class="text-xs text-error font-medium animate-pulse">-\${{ excedente() | number:'1.0-0' }} excedido</p>
            }
          </div>
        </div>

        <div class="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            [class]="getBarColorClass()"
            [style.width.%]="Math.min(pct(), 100)"
            [class.animate-pulse]="getEstado() === 'critico'"
          ></div>
        </div>

        @if (getEstado() !== 'saludable') {
          <div [class]="'py-2 px-3 rounded-xl mt-2 flex items-start gap-2 text-sm ' + getAlertaClass()">
            <span>{{ getAlertaIcon() }}</span>
            <span class="flex-1 leading-tight">{{ getAlertaMensaje() }}</span>
            @if (!categoria.tipo_alerta.persistencia_alerta) {
              <button (click)="dismissAlerta.set(true)" class="btn btn-ghost btn-xs p-0 min-h-0 h-auto opacity-60 hover:opacity-100">
                ✕
              </button>
            }
            @if (categoria.tipo_alerta.persistencia_alerta && categoria.tipo_alerta.requiere_confirmacion_lectura) {
              <span class="badge badge-outline badge-xs opacity-70">Requiere revisión</span>
            }
          </div>
        }

        <div class="flex gap-2 mt-3">
          <div class="join flex-1">
            <span class="join-item flex items-center px-3 bg-base-200 text-base-content/50 text-sm border border-base-300 rounded-l-xl">
              $
            </span>
            <input
              type="number"
              [(ngModel)]="montoInput"
              (keydown.enter)="agregar()"
              placeholder="0.00"
              class="input input-bordered input-sm flex-1 join-item focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <button (click)="agregar()" class="btn btn-primary btn-sm gap-1 rounded-xl">
            <span>+</span>
            Agregar
          </button>
        </div>

        <button
          (click)="expandido.set(!expandido())"
          class="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/70 transition-colors w-fit"
        >
          <span [class]="expandido() ? 'rotate-90' : ''" class="transition-transform">▶</span>
          {{ categoria.subcategorias.length }} subcategorías
        </button>

        @if (expandido()) {
          <div class="flex flex-wrap gap-1.5 pt-1">
            @for (sub of categoria.subcategorias; track sub.id) {
              <div
                [class]="'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ' + getColorToken().border + ' ' + getColorToken().bg + ' ' + getColorToken().accent"
              >
                <span>{{ getSubIcono(sub.icono) }}</span>
                {{ sub.nombre }}
              </div>
            }
          </div>
        }

        <div [class]="'rounded-xl p-2.5 border flex items-center gap-2 ' + getColorToken().border + ' ' + getColorToken().bg">
          <span [class]="'text-sm ' + getColorToken().accent">🎯</span>
          <p [class]="'text-xs ' + getColorToken().accent + ' leading-tight'">
            {{ categoria.gamificacion.descripcion_reto }}
          </p>
        </div>
      </div>
    </div>
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
    if (estado === 'critico') return 'badge badge-error';
    if (estado === 'advertencia') return 'badge badge-warning';
    return 'badge badge-success';
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
    if (estado === 'critico') {
      return this.categoria.tipo_alerta.mensaje_critico;
    }
    return this.categoria.tipo_alerta.mensaje_advertencia.replace('{pct}', pct.toString());
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