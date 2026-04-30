import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Component } from '@angular/core';
import { ExecutiveSummaryComponent } from './app/pages/executive-summary.component';
import { Fase1ResearchComponent } from './app/pages/fase1-research.component';
import { Fase2DefinicionComponent } from './app/pages/fase2-definicion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-base-200 text-base-content">
      <header class="navbar border-b border-base-300 bg-base-100 px-6">
        <div class="navbar-start">
          <a class="text-lg font-semibold">Colmena Design System</a>
        </div>
        <div class="navbar-center hidden md:flex">
          <ul class="menu menu-horizontal gap-2 px-1">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Resumen</a></li>
            <li><a routerLink="/fase-1" routerLinkActive="active">Fase 1</a></li>
            <li><a routerLink="/fase-2" routerLinkActive="active">Fase 2</a></li>
          </ul>
        </div>
      </header>

      <main class="mx-auto max-w-7xl p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: ExecutiveSummaryComponent },
      { path: 'fase-1', component: Fase1ResearchComponent },
      { path: 'fase-2', component: Fase2DefinicionComponent },
    ]),
  ],
}).catch((error) => console.error(error));
