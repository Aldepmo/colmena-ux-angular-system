import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <article class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <p class="text-4xl font-bold text-primary">{{ value() }}</p>
        <p class="text-base-content/70">{{ label() }}</p>
      </div>
    </article>
  `,
})
export class KpiCardComponent {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
}
