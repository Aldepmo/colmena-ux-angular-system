import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      role="alert"
      [attr.aria-live]="variant === 'error' ? 'assertive' : 'polite'"
      [class]="alertClass"
    >
      @if (icon) {
        <span class="w-4 h-4 shrink-0" aria-hidden="true">{{ icon }}</span>
      }
      <span class="flex-1 leading-snug">
        <ng-content></ng-content>
      </span>

      @if (persistent) {
        <app-badge variant="info" outline size="xs">Requiere revisión</app-badge>
      }

      @if (dismissible && !persistent && onDismiss) {
        <button
          (click)="onDismiss.emit()"
          aria-label="Cerrar alerta"
          class="btn btn-ghost btn-xs btn-circle p-0 min-h-0 h-6 w-6 opacity-60 hover:opacity-100 focus-visible:opacity-100"
        >
          ✕
        </button>
      }
    </div>
  `
})
export class AlertComponent {
  @Input() variant: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() icon: string | null = null;
  @Input() dismissible = true;
  @Input() persistent = false;

  @Output() onDismiss = new EventEmitter<void>();

  private get variants() {
    return {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
    };
  }

  get alertClass(): string {
    return `alert py-2.5 px-3.5 rounded-xl text-sm ${this.variants[this.variant]}`;
  }
}