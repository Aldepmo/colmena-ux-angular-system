import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-control w-full">
      @if (label) {
        <label [for]="inputId" class="label pb-1 pt-0">
          <span class="label-text text-sm font-medium text-base-content">
            {{ label }}
            @if (required) {
              <span class="text-error ml-1" aria-hidden="true">*</span>
            }
          </span>
          @if (hint && !error) {
            <span [id]="hintId" class="label-text-alt text-base-content/50 text-xs">{{ hint }}</span>
          }
        </label>
      }

      <div [class]="'flex items-center ' + (prefix || suffix ? 'join' : '')">
        @if (prefix) {
          <span class="join-item flex items-center px-3 bg-base-200 border border-base-300 text-base-content/50 text-sm h-full min-h-[44px] select-none" aria-hidden="true">
            {{ prefix }}
          </span>
        }
        <input
          [id]="inputId"
          [type]="type"
          [(ngModel)]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [min]="min"
          [max]="max"
          [attr.aria-describedby]="describedBy"
          [attr.aria-invalid]="error ? 'true' : null"
          [class]="inputClass"
          (keydown)="onKeyDown.emit($event)"
        />
        @if (suffix) {
          <span class="join-item flex items-center px-3 bg-base-200 border border-base-300 text-base-content/50 text-sm h-full min-h-[44px] select-none" aria-hidden="true">
            {{ suffix }}
          </span>
        }
      </div>

      @if (error || success) {
        <label class="label pt-1 pb-0">
          <span [id]="errorId" [class]="'label-text-alt text-xs ' + (error ? 'text-error' : 'text-success')" [attr.role]="error ? 'alert' : null" [attr.aria-live]="error ? 'polite' : null">
            {{ error || success }}
          </span>
        </label>
      }
    </div>
  `
})
export class InputComponent {
  @Input() label: string | null = null;
  @Input() hint: string | null = null;
  @Input() error: string | null = null;
  @Input() success: string | null = null;
  @Input() type: 'text' | 'number' | 'currency' = 'text';
  @Input() prefix: string | null = null;
  @Input() suffix: string | null = null;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() onKeyDown = new EventEmitter<KeyboardEvent>();

  value: string | number | null = null;

  get inputId(): string {
    return `input-${Math.random().toString(36).slice(2, 7)}`;
  }

  get hintId(): string {
    return `${this.inputId}-hint`;
  }

  get errorId(): string {
    return `${this.inputId}-error`;
  }

  get describedBy(): string {
    const parts = [this.error ? this.errorId : null, this.hint ? this.hintId : null].filter(Boolean);
    return parts.length ? parts.join(' ') : undefined;
  }

  private get sizeClass(): string {
    const map: Record<string, string> = {
      sm: 'input-sm text-sm',
      md: 'input-md text-sm',
      lg: 'input-lg text-base',
    };
    return map[this.size];
  }

  private get stateClass(): string {
    if (this.error) return 'input-error';
    if (this.success) return 'input-success';
    return 'input-bordered focus:input-primary';
  }

  get inputClass(): string {
    const classes = [
      'input w-full',
      this.sizeClass,
      this.stateClass,
      this.prefix ? 'join-item rounded-l-none' : '',
      this.suffix ? 'join-item rounded-r-none' : '',
      'focus:outline-none transition-colors duration-150',
    ];
    return classes.filter(Boolean).join(' ');
  }
}