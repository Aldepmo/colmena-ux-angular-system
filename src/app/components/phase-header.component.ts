import { Component, input } from '@angular/core';
import { BadgeComponent } from './atoms/badge.component';

@Component({
  selector: 'app-phase-header',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <app-badge [variant]="toneToVariant()" [outline]="true">{{ eyebrow() }}</app-badge>
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

  toneToVariant(): 'primary' | 'info' | 'warning' | 'neutral' {
    return this.tone();
  }
}
