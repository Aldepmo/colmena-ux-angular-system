import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  standalone: true,
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        @if (title()) {
          <h2 class="card-title text-secondary">{{ title() }}</h2>
        }
        <ng-content />
      </div>
    </div>
  `,
})
export class SectionCardComponent {
  readonly title = input<string>('');
}
