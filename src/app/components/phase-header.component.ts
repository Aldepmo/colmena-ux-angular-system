import { Component, input } from '@angular/core';

@Component({
  selector: 'app-phase-header',
  standalone: true,
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="badge" [class]="badgeClass()">{{ eyebrow() }}</div>
        <h1 class="text-3xl font-bold">
          {{ title() }} <span class="text-primary">{{ highlight() }}</span>
        </h1>
        <p class="text-base-content/70">{{ description() }}</p>
      </div>
    </div>
  `,
})
export class PhaseHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly highlight = input.required<string>();
  readonly description = input.required<string>();
  readonly tone = input<'primary' | 'info' | 'warning'>('primary');

  badgeClass(): string {
    const tone = this.tone();
    return tone === 'info'
      ? 'badge badge-info badge-outline'
      : tone === 'warning'
        ? 'badge badge-warning badge-outline'
        : 'badge badge-primary badge-outline';
  }
}
