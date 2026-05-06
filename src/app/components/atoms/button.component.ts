import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      (click)="onClick.emit($event)"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
      [class]="buttonClass"
    >
      @if (loading) {
        <span class="loading loading-spinner loading-xs" aria-hidden="true"></span>
      }
      @if (!loading && icon && iconPosition === 'left') {
        <span class="w-4 h-4" aria-hidden="true">{{ icon }}</span>
      }
      <ng-content></ng-content>
      @if (!loading && icon && iconPosition === 'right') {
        <span class="w-4 h-4" aria-hidden="true">{{ icon }}</span>
      }
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'neutral' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() icon: string | null = null;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel: string | null = null;

  @Output() onClick = new EventEmitter<Event>();

  private get variants() {
    const map: Record<string, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      danger: 'btn-error',
      outline: 'btn-outline btn-primary',
      neutral: 'btn-neutral',
    };
    return map[this.variant];
  }

  private get sizes() {
    const map: Record<string, string> = {
      sm: 'btn-sm text-xs min-h-[36px]',
      md: 'btn-md text-sm min-h-[44px]',
      lg: 'btn-lg text-base min-h-[52px]',
    };
    return map[this.size];
  }

  get buttonClass(): string {
    const classes = [
      'btn font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95',
      this.variants,
      this.sizes,
      this.fullWidth ? 'w-full' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }
}