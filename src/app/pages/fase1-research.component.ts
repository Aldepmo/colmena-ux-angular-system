import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhaseHeaderComponent } from '../components/phase-header.component';
import { SectionCardComponent } from '../components/section-card.component';

interface PersonaItem {
  name: string;
  subtitle: string;
  device: string;
  context: string;
  pain: string;
  goal: string;
}

@Component({
  selector: 'app-fase1-research',
  standalone: true,
  imports: [RouterLink, PhaseHeaderComponent, SectionCardComponent],
  template: `
    <section class="space-y-6">
      <app-phase-header
        eyebrow="Fase 1 · Design Thinking"
        title="Empatia e"
        highlight="Investigacion"
        description="Quienes son las usuarias, que piensan, que sienten y donde el sistema actual las falla."
        tone="info"
      />

      <app-section-card title="Proto-personas">
        <div class="grid gap-4 md:grid-cols-2">
          @for (persona of personas; track persona.name) {
            <article class="card border border-base-300 bg-base-100">
              <div class="card-body">
                <h3 class="card-title text-lg">{{ persona.name }}</h3>
                <p class="text-sm text-base-content/70">{{ persona.subtitle }}</p>
                <p><strong>Dispositivo:</strong> {{ persona.device }}</p>
                <p><strong>Contexto:</strong> {{ persona.context }}</p>
                <div class="flex flex-wrap gap-2">
                  <span class="badge badge-error badge-outline">{{ persona.pain }}</span>
                  <span class="badge badge-success badge-outline">{{ persona.goal }}</span>
                </div>
              </div>
            </article>
          }
        </div>
      </app-section-card>

      <app-section-card title="Mapa de empatia (arquetipo principal)">
        <div class="grid gap-3 md:grid-cols-2">
          @for (item of empathyItems; track item.text) {
            <div class="alert" [class]="item.className">{{ item.text }}</div>
          }
        </div>
      </app-section-card>

      <app-section-card title="Auditoria UX (hallazgos)">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Severidad</th>
                <th>Hallazgo</th>
                <th>Area</th>
              </tr>
            </thead>
            <tbody>
              @for (finding of findings; track finding.title) {
                <tr>
                  <td><span class="badge" [class]="finding.badgeClass">{{ finding.severity }}</span></td>
                  <td>{{ finding.title }}</td>
                  <td>{{ finding.area }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </app-section-card>

      <div class="flex flex-wrap gap-3">
        <a class="btn btn-primary" routerLink="/fase-2">Continuar a Fase 2</a>
        <a class="btn btn-secondary" routerLink="/">Volver al resumen</a>
      </div>
    </section>
  `,
})
export class Fase1ResearchComponent {
  readonly personas: PersonaItem[] = [
    {
      name: 'Maria Guadalupe',
      subtitle: 'Venta de comida · 38 años · México',
      device: 'Android gama media, datos limitados.',
      context: 'Cuaderno de anotaciones, no banco formal.',
      pain: 'Miedo a perder datos',
      goal: 'Saber si le alcanza',
    },
    {
      name: 'Lucia Rodriguez',
      subtitle: 'Artesanía y ropa · 45 años · Colombia',
      device: 'Smartphone basico, WiFi en casa.',
      context: 'Confunde costos con ganancias.',
      pain: 'Formularios intimidantes',
      goal: 'Ahorrar para crecer',
    },
    {
      name: 'Ana Perez',
      subtitle: 'Peluquería móvil · 29 años · Perú',
      device: 'iPhone basico, buena conectividad.',
      context: 'Adopta apps si son simples y claras.',
      pain: 'Mucho texto en pantalla',
      goal: 'Tener control real',
    },
    {
      name: 'Rosa Chavez',
      subtitle: 'Tienda de barrio · 54 años · Bolivia',
      device: 'Android basico, pantalla pequena.',
      context: 'Necesita guia paso a paso.',
      pain: 'Mezcla finanzas personales',
      goal: 'Dejar deudas',
    },
  ];

  readonly empathyItems = [
    { text: 'Dice: "No entiendo que significa flujo de caja".', className: 'alert-info' },
    { text: 'Piensa: herramientas financieras son para gente estudiada.', className: 'alert-warning' },
    { text: 'Hace: abre la app, ve el formulario y cierra.', className: 'alert-accent' },
    { text: 'Siente: ansiedad ante formularios con muchos campos.', className: 'alert-error' },
    { text: 'Frustraciones: terminologia financiera, bajo contraste, flujo largo.', className: 'alert-error' },
    { text: 'Motivaciones: saber si el negocio va bien y ver progreso.', className: 'alert-success' },
  ] as const;

  readonly findings = [
    { severity: 'Critico', title: 'Terminologia sin traduccion empatica.', area: 'UX Writing', badgeClass: 'badge-error' },
    { severity: 'Critico', title: 'Flujo de registro de 7+ pasos.', area: 'Flujo', badgeClass: 'badge-error' },
    { severity: 'Critico', title: 'Sin feedback inmediato tras accion.', area: 'Microinteraccion', badgeClass: 'badge-error' },
    { severity: 'Moderado', title: 'Contraste insuficiente en exteriores.', area: 'Accesibilidad', badgeClass: 'badge-warning' },
    { severity: 'Moderado', title: 'Dashboard sin jerarquia de informacion.', area: 'IA Visual', badgeClass: 'badge-warning' },
  ] as const;
}
