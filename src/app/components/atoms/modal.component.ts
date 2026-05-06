import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="modal modal-open" role="dialog" aria-modal="true" [attr.aria-labelledby]="modalTitleId" (click)="closeOnBackdrop ? onClose.emit() : null">
        <div class="modal-box p-0 overflow-hidden" [class]="sizeClass" (click)="$event.stopPropagation()">
          <div class="p-4 flex justify-between items-center border-b border-base-300">
            <h3 [id]="modalTitleId" class="font-bold text-lg">{{ title }}</h3>
            <button (click)="onClose.emit()" aria-label="Cerrar" class="btn btn-ghost btn-sm btn-circle">✕</button>
          </div>
          <div class="p-4">
            <ng-content></ng-content>
          </div>
          @if (footer) {
            <div class="p-4 border-t border-base-300 flex justify-end gap-2">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() footer = false;
  @Input() closeOnBackdrop = true;

  @Output() onClose = new EventEmitter<void>();

  get modalTitleId(): string {
    return 'colmena-modal-title';
  }

  private get sizeClass(): string {
    const map: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };
    return map[this.size];
  }
}