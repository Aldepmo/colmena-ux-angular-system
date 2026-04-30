import { Component, input } from '@angular/core';

@Component({
  selector: 'app-phase-row',
  standalone: true,
  template: `
    <div class="flex items-center justify-between rounded-box border border-base-300 p-4">
      <div>
        <p class="font-semibold">{{ number() }} · {{ title() }}</p>
        <p class="text-sm text-base-content/70">{{ subtitle() }}</p>
      </div>
      <span class="badge" [class]="badgeClass()">{{ badge() }}</span>
    </div>
  `,
})
export class PhaseRowComponent {
  readonly number = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly badge = input.required<string>();
  readonly tone = input<'info' | 'warning' | 'accent'>('info');

  badgeClass(): string {
    const tone = this.tone();
    return tone === 'warning'
      ? 'badge badge-warning'
      : tone === 'accent'
        ? 'badge badge-accent'
        : 'badge badge-info';
  }
}
