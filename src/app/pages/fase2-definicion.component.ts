import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhaseHeaderComponent } from '../components/phase-header.component';
import { SectionCardComponent } from '../components/section-card.component';

@Component({
  selector: 'app-fase2-definicion',
  standalone: true,
  imports: [RouterLink, PhaseHeaderComponent, SectionCardComponent],
  template: `
    <section class="space-y-6">
      <app-phase-header
        eyebrow="Fase 2 · Design Thinking"
        title="Definicion y"
        highlight="Estrategia"
        description="Journey map del flujo actual, benchmark competitivo y estrategia de UX Writing para traducir lenguaje financiero."
        tone="warning"
      />

      <app-section-card title="User journey map (flujo actual)">
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Etapa</th>
                <th>Pensamiento</th>
                <th>Accion</th>
                <th>Pain point</th>
                <th>Oportunidad</th>
              </tr>
            </thead>
            <tbody>
              @for (row of journeyRows; track row.stage) {
                <tr>
                  <td>{{ row.stage }}</td>
                  <td>{{ row.thought }}</td>
                  <td>{{ row.action }}</td>
                  <td>{{ row.pain }}</td>
                  <td>{{ row.opportunity }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </app-section-card>

      <app-section-card title="Benchmark competitivo">
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          @for (item of benchmark; track item.name) {
            <article class="card border border-base-300 bg-base-100">
              <div class="card-body">
                <h3 class="card-title text-lg">{{ item.name }}</h3>
                <p class="text-sm text-base-content/70">{{ item.note }}</p>
              </div>
            </article>
          }
        </div>
      </app-section-card>

      <app-section-card title="Diccionario UX Writing">
        <div class="space-y-2">
          @for (entry of dictionary; track entry.from) {
            <div class="flex flex-wrap items-center gap-2 rounded-box border border-base-300 p-3">
              <span class="badge badge-error badge-outline">{{ entry.from }}</span>
              <span>→</span>
              <span class="badge badge-success badge-outline">{{ entry.to }}</span>
            </div>
          }
        </div>
      </app-section-card>

      <app-section-card title="Preguntas HMW">
        <div class="grid gap-3 md:grid-cols-2">
          @for (question of hmwQuestions; track question) {
            <div class="alert alert-warning">{{ question }}</div>
          }
        </div>
      </app-section-card>

      <div class="flex flex-wrap gap-3">
        <button class="btn btn-primary">Continuar a Fase 3</button>
        <a class="btn btn-secondary" routerLink="/fase-1">Volver a Fase 1</a>
      </div>
    </section>
  `,
})
export class Fase2DefinicionComponent {
  readonly journeyRows = [
    { stage: 'Apertura', thought: 'Como entro al modulo?', action: 'Busca icono en menu', pain: 'Icono no reconocible', opportunity: 'Etiqueta "Mi dinero"' },
    { stage: 'Dashboard', thought: 'Que significa todo esto?', action: 'Escanea sin foco', pain: 'Numeros sin contexto', opportunity: 'Semaforo visual simple' },
    { stage: 'Registro', thought: 'Ingreso o egreso?', action: 'Toca "+" y ve formulario', pain: '7 campos de golpe', opportunity: 'Flujo de 2 pasos maximo' },
    { stage: 'Categoria', thought: 'En cual categoria va?', action: 'Dropdown anidado', pain: '15 categorias tecnicas', opportunity: '5 categorias con icono' },
    { stage: 'Guardar', thought: 'Se guardo bien?', action: 'Toca guardar', pain: 'Sin confirmacion clara', opportunity: 'Toast + animacion' },
  ] as const;

  readonly benchmark = [
    { name: 'Alegra', note: 'Registro rapido, pero lenguaje semi-tecnico.' },
    { name: 'Fintual', note: 'Referente en UX Writing empatico.' },
    { name: 'Contabilium', note: 'Modelo a evitar por complejidad tecnica.' },
    { name: 'Klar', note: 'Microinteracciones y tono cercano.' },
    { name: 'Nubank', note: 'Referente global en simplicidad movil.' },
    { name: 'Nequi', note: 'Tono familiar para el contexto LATAM.' },
  ] as const;

  readonly dictionary = [
    { from: 'Flujo de caja', to: 'Cuanto entra y cuanto sale?' },
    { from: 'Egreso / Gasto', to: 'Lo que gaste hoy' },
    { from: 'Ingreso / Venta', to: 'Lo que gane hoy' },
    { from: 'Rentabilidad', to: 'Tu negocio esta ganando?' },
  ] as const;

  readonly hmwQuestions = [
    'Como podriamos reducir el registro de una venta a menos de 20 segundos?',
    'Como podriamos mostrar salud financiera en un solo vistazo?',
    'Como podriamos generar orgullo en el primer registro exitoso?',
    'Como podriamos usar lenguaje cotidiano sin perder confianza?',
  ] as const;
}
