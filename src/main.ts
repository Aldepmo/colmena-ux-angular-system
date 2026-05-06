import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, signal } from '@angular/core';
import { ExecutiveSummaryComponent } from './app/pages/executive-summary.component';
import { Fase1ResearchComponent } from './app/pages/fase1-research.component';
import { Fase2DefinicionComponent } from './app/pages/fase2-definicion.component';
import { SaludFinancieraComponent } from './app/pages/salud-financiera.component';
import { ThemeToggleComponent } from './app/components/atoms/theme-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-base-200 text-base-content">
      <header class="navbar border-b border-base-300 bg-base-100 px-6">
        <div class="navbar-start">
          <a class="text-lg font-semibold">Colmena Design System</a>
        </div>
        <div class="navbar-center lg:flex hidden">
          <ul class="menu menu-horizontal gap-1 lg:gap-2 px-1">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="hidden lg:inline">Resumen</a></li>
            <li><a routerLink="/fase-1" routerLinkActive="active" class="hidden lg:inline">Fase 1</a></li>
            <li><a routerLink="/fase-2" routerLinkActive="active" class="hidden lg:inline">Fase 2</a></li>
            <li><a routerLink="/salud-financiera" routerLinkActive="active" class="text-primary font-semibold hidden lg:inline">Salud Financiera</a></li>
          </ul>
          <app-theme-toggle class="hidden lg:inline ml-4" />
        </div>
        <div class="navbar-end md:hidden">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-square" (click)="menuAbierto.set(!menuAbierto())">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            @if (menuAbierto()) {
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-50 mt-2 w-56 p-2 shadow-lg border border-base-300 absolute right-0">
                <li><a (click)="cerrarMenu()" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="btn btn-ghost btn-sm justify-start">Resumen</a></li>
                <li><a (click)="cerrarMenu()" routerLink="/fase-1" routerLinkActive="active" class="btn btn-ghost btn-sm justify-start">Fase 1</a></li>
                <li><a (click)="cerrarMenu()" routerLink="/fase-2" routerLinkActive="active" class="btn btn-ghost btn-sm justify-start">Fase 2</a></li>
                <li><a (click)="cerrarMenu()" routerLink="/salud-financiera" routerLinkActive="active" class="btn btn-ghost btn-sm justify-start text-primary font-semibold">Salud Financiera</a></li>
              </ul>
            }
          </div>
          <app-theme-toggle />
        </div>
      </header>

      <main class="mx-auto max-w-7xl p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
class AppComponent {
  menuAbierto = signal(false);

  cerrarMenu() {
    this.menuAbierto.set(false);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: ExecutiveSummaryComponent },
      { path: 'fase-1', component: Fase1ResearchComponent },
      { path: 'fase-2', component: Fase2DefinicionComponent },
      { path: 'salud-financiera', component: SaludFinancieraComponent },
    ]),
  ],
}).catch((error) => console.error(error));
