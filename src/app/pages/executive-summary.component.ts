import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhaseHeaderComponent } from '../components/phase-header.component';
import { KpiCardComponent } from '../components/kpi-card.component';
import { PhaseRowComponent } from '../components/phase-row.component';
import { SectionCardComponent } from '../components/section-card.component';

interface KpiItem {
  value: string;
  label: string;
}

interface PhaseItem {
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  tone: 'info' | 'warning' | 'accent';
}

@Component({
  selector: 'app-executive-summary',
  standalone: true,
  imports: [RouterLink, PhaseHeaderComponent, KpiCardComponent, PhaseRowComponent, SectionCardComponent],
  template: `
    <section class="space-y-6">
      <app-phase-header
        eyebrow="Case study · UX/UI Redesign · 2026"
        title="Modulo de"
        highlight="Salud Financiera - Colmena / Sustentia"
        description="Rediseno de la experiencia de registro financiero para microempresarias latinoamericanas con baja alfabetizacion digital, bajo la metodologia Design Thinking."
      />

      <app-section-card>
        <div class="flex flex-wrap gap-3">
          @for (tag of tags; track tag) {
            <span class="badge" [class]="tag.className">{{ tag.text }}</span>
          }
        </div>
      </app-section-card>

      <div class="grid gap-4 md:grid-cols-3">
        @for (kpi of kpis; track kpi.label) {
          <app-kpi-card [value]="kpi.value" [label]="kpi.label" />
        }
      </div>

      <app-section-card title="Problema central">
        <div class="grid gap-3 md:grid-cols-2">
          @for (problem of coreProblems; track problem) {
            <div class="alert alert-error">{{ problem }}</div>
          }
        </div>
      </app-section-card>

      <app-section-card title="Plan de ejecucion por fases">
        <div class="space-y-2">
          @for (phase of phases; track phase.number) {
            <app-phase-row
              [number]="phase.number"
              [title]="phase.title"
              [subtitle]="phase.subtitle"
              [badge]="phase.badge"
              [tone]="phase.tone"
            />
          }
        </div>
      </app-section-card>

      <app-section-card title="Stack de herramientas">
        <div class="flex flex-wrap gap-2">
          @for (tool of tools; track tool) {
            <span class="badge badge-outline">{{ tool }}</span>
          }
        </div>
      </app-section-card>

      <div class="alert alert-warning">
        <span>
          <strong>Valor diferencial:</strong> foco en eficiencia operativa del modulo, con prototipos funcionales para validar logica de negocio antes del desarrollo completo.
        </span>
      </div>

      <div class="flex flex-wrap gap-3">
        <a class="btn btn-primary" routerLink="/fase-1">Comenzar con Fase 1</a>
        <button class="btn btn-secondary">Ver diseno hi-fi</button>
      </div>
    </section>
  `,
})
export class ExecutiveSummaryComponent {
  readonly tags = [
    { text: 'Microfinanzas · Impacto social', className: 'badge-secondary badge-outline' },
    { text: '5 fases · Design Thinking', className: 'badge-primary badge-outline' },
    { text: 'Mobile-first · WCAG AA', className: 'badge-accent badge-outline' },
  ] as const;

  readonly kpis: KpiItem[] = [
    { value: '5', label: 'Fases de diseno completadas' },
    { value: '3+', label: 'Rondas de usability testing' },
    { value: '1', label: 'Sistema de diseno escalable' },
  ];

  readonly coreProblems = [
    'Lenguaje financiero tecnico genera friccion y abandono en usuarias con baja alfabetizacion digital.',
    'El flujo de registro de ingresos y egresos no genera valor inmediato ni habito de uso.',
    'Interfaz no optimizada para dispositivos moviles de gama media en entornos con luz intensa.',
    'Sin indicadores de salud financiera que motiven la toma de decisiones basada en datos.',
  ] as const;

  readonly phases: PhaseItem[] = [
    { number: '01', title: 'Empatia e Investigacion', subtitle: 'Auditoria UX · Proto-personas · Entrevistas', badge: 'Research', tone: 'info' },
    { number: '02', title: 'Definicion y Estrategia', subtitle: 'User journey · Benchmark · UX Writing', badge: 'Estrategia', tone: 'warning' },
    { number: '03', title: 'Ideacion y Prototipado', subtitle: 'Arquitectura · Wireframes · Gamificacion', badge: 'Ideacion', tone: 'warning' },
    { number: '04', title: 'Diseno Visual y Sistema', subtitle: 'Atomic design · Mobile-first · Accesibilidad', badge: 'Diseno', tone: 'accent' },
    { number: '05', title: 'Validacion y Testing', subtitle: 'Maze · Insights · Handoff', badge: 'Testing', tone: 'info' },
  ];

  readonly tools = ['Figma', 'Maze', 'Notion', 'Claude', 'Miro', 'WCAG 2.1', 'Atomic Design'] as const;
}
