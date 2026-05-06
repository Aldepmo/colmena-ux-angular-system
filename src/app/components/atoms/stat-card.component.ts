import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-base-200 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
      <span [class]="'w-4 h-4 shrink-0 ' + accentColor" aria-hidden="true">{{ icon }}</span>
      <div>
        <p class="text-[10px] text-base-content/50 leading-none uppercase tracking-widest">
          {{ label }}
        </p>
        <p class="font-bold text-sm text-base-content leading-tight mt-0.5">
          {{ value }}{{ sub ? ' ' + sub : '' }}
        </p>
        @if (sub) {
          <p class="text-[10px] text-base-content/40 leading-none mt-0.5">{{ sub }}</p>
        }
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() icon: string = '📊';
  @Input() accent: 'warning' | 'accent' | 'primary' = 'warning';
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() sub: string | null = null;

  private get accentColors(): Record<string, string> {
    return {
      warning: 'text-warning',
      accent: 'text-accent',
      primary: 'text-primary',
    };
  }

  get accentColor(): string {
    return this.accentColors[this.accent] || 'text-warning';
  }
}