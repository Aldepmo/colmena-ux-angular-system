import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div role="progressbar" [attr.aria-valuenow]="percent" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="label || percent + '% del límite'">
      @if (showLabel) {
        <div class="flex justify-between mb-1">
          <span class="text-xs text-base-content/60">{{ label }}</span>
          <span [class]="'text-xs font-semibold ' + textColor">{{ percent }}%</span>
        </div>
      }
      <div [class]="'w-full bg-base-300 rounded-full overflow-hidden ' + trackSize">
        <div
          [class]="fillClass"
          [style.width.%]="percent"
        ></div>
      </div>
    </div>
  `
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() estado: 'saludable' | 'advertencia' | 'critico' = 'saludable';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() showLabel = false;
  @Input() label: string | null = null;
  @Input() animated = true;

  get percent(): number {
    return Math.min(Math.round((this.value / this.max) * 100), 100);
  }

  private get trackSize(): string {
    const map: Record<string, string> = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
    return map[this.size];
  }

  private get fillColor(): string {
    const map: Record<string, string> = {
      saludable: 'bg-success',
      advertencia: 'bg-warning',
      critico: 'bg-error',
    };
    return map[this.estado];
  }

  private get textColor(): string {
    const map: Record<string, string> = {
      saludable: 'text-success',
      advertencia: 'text-warning',
      critico: 'text-error',
    };
    return map[this.estado];
  }

  get fillClass(): string {
    const classes = [
      'h-full rounded-full transition-all duration-700 ease-out',
      this.fillColor,
      this.estado === 'critico' && this.animated ? 'animate-pulse' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }
}