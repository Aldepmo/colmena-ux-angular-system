import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass">
      @if (icon) {
        <span class="w-3 h-3" aria-hidden="true">{{ icon }}</span>
      }
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'ghost' = 'neutral';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() outline = false;

  private get variants() {
    return {
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
      info: 'badge-info',
      neutral: 'badge-neutral',
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      ghost: 'badge-ghost',
    };
  }

  private get sizes() {
    return {
      xs: 'badge-xs text-[10px]',
      sm: 'badge-sm text-xs',
      md: 'text-xs',
      lg: 'badge-lg text-sm',
    };
  }

  get badgeClass(): string {
    const classes = [
      'badge font-medium gap-1 items-center',
      this.variants[this.variant],
      this.sizes[this.size],
      this.outline ? 'badge-outline' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }
}