import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-streak-dot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [attr.aria-label]="activo ? 'Día ' + (index + 1) + ' completado' : 'Día ' + (index + 1) + ' pendiente'"
      [class]="dotClass"
    >
      @if (activo) {
        ✓
      } @else {
        {{ index + 1 }}
      }
    </div>
  `
})
export class StreakDotComponent {
  @Input() index = 0;
  @Input() activo = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  private get sizes() {
    return {
      sm: 'w-5 h-5 text-[9px]',
      md: 'w-7 h-7 text-xs',
      lg: 'w-9 h-9 text-sm',
    };
  }

  get dotClass(): string {
    const classes = [
      'rounded-lg flex items-center justify-center font-bold transition-all duration-300',
      this.sizes[this.size],
      this.activo
        ? 'bg-warning text-warning-content scale-110 shadow-sm'
        : 'bg-base-300 text-base-content/30',
    ];
    return classes.filter(Boolean).join(' ');
  }
}