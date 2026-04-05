import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, PercentPipe, DatePipe } from '@angular/common';
import { RaffleService } from '../../../core/services/raffle.service';
import { Raffle } from '../../../core/models/raffle.interface';
import { RaffleStats } from '../../../core/models/raffle-stats.interface';

@Component({
  selector: 'app-raffle-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PercentPipe, DatePipe, ReactiveFormsModule, RouterLink],
  template: `
    <div *ngIf="raffle; else loading" class="space-y-6">
      
      <!-- Header Area -->
      <div class="flex items-center justify-between">
        <div>
           <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ raffle.name }}</h2>
           <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Estado: 
              <span [ngClass]="{
                 'text-green-600 bg-green-100': raffle.status === 'active',
                 'text-gray-600 bg-gray-100': raffle.status === 'completed'
              }" class="px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wide">
                 {{ raffle.status || 'Desconocido' }}
              </span>
           </p>
        </div>
        <a routerLink="/raffles" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium">
           &larr; Volver al listado
        </a>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Revenue Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border-l-4 border-primary-500">
           <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium">Recaudación Total</h3>
           <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
             {{ stats?.revenue_total | currency:'USD' }}
           </p>
        </div>
        <!-- Sold Cards -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border-l-4 border-blue-500">
           <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium">Boletos Vendidos</h3>
           <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
             {{ stats?.tickets_sold }} <span class="text-sm text-gray-400 font-normal">/ {{ stats?.tickets_total || raffle.number_to }}</span>
           </p>
        </div>
        <!-- Available -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border-l-4 border-orange-500">
           <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium">Boletos Disponibles</h3>
           <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
             {{ stats?.tickets_available }}
           </p>
        </div>
        <!-- Progress -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border-l-4 border-purple-500">
           <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium">Progreso de Ventas</h3>
           <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
             {{ stats?.percentage_sold! / 100 | percent:'1.1-2' }}
           </p>
           <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
             <div class="bg-purple-500 h-1.5 rounded-full" [style.width.%]="stats?.percentage_sold"></div>
           </div>
        </div>
      </div>

      <!-- Action Area: Draw Winner -->
      <div class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Sorteo de Rifa</h3>
        
        <div *ngIf="raffle.winner_ticket; else drawFormTpl" class="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
           <p class="text-primary-800 dark:text-primary-300">
             🌟 Esta rifa ya fue sorteada. El número ganador es: <span class="font-bold text-2xl ml-2">{{ raffle.winner_ticket }}</span>
           </p>
        </div>

        <ng-template #drawFormTpl>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
             Ingresa el ticket ganador para concluir esta rifa. Esta acción es irreversible.
          </p>
          <form [formGroup]="drawForm" (ngSubmit)="executeDraw()" class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
             <div class="flex-1 w-full sm:max-w-xs">
                <label for="winning_number" class="sr-only">Número Ganador</label>
                <input id="winning_number" type="number" min="0" formControlName="winning_number" placeholder="Ej. 1024"
                   class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border">
                <div *ngIf="drawForm.get('winning_number')?.touched && drawForm.get('winning_number')?.invalid" class="text-red-500 text-xs mt-1">
                   El número es requerido y debe ser entero.
                </div>
             </div>
             <button type="submit" [disabled]="drawForm.invalid || isDrawing"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                <svg *ngIf="isDrawing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isDrawing ? 'Sorteando...' : '¡Ejecutar Sorteo!' }}
             </button>
          </form>
          
          <div *ngIf="drawSuccessMessage" class="rounded-md bg-green-50 dark:bg-green-900/30 p-4 border border-green-200 dark:border-green-800 mt-4">
             <div class="text-sm text-green-700 dark:text-green-400 font-medium whitespace-pre-wrap">{{ drawSuccessMessage }}</div>
          </div>
          <div *ngIf="drawError" class="text-red-500 text-sm mt-3">{{ drawError }}</div>
        </ng-template>

      </div>

    </div>

    <ng-template #loading>
      <div class="flex justify-center items-center h-64">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    </ng-template>
  `
})
export class RaffleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private raffleService = inject(RaffleService);
  private fb = inject(FormBuilder);

  raffle: Raffle | null = null;
  stats: RaffleStats | null = null;
  raffleId!: string;

  drawForm: FormGroup = this.fb.group({
    winning_number: ['', [Validators.required, Validators.min(0)]]
  });
  
  isDrawing = false;
  drawError = '';
  drawSuccessMessage = '';

  ngOnInit() {
    this.raffleId = this.route.snapshot.paramMap.get('id') || '';
    if (this.raffleId) {
      this.loadData();
    }
  }

  loadData() {
    this.raffleService.getRaffle(this.raffleId).subscribe({
      next: (res) => this.raffle = res,
      error: () => this.drawError = 'Error loading raffle details'
    });

    this.raffleService.getRaffleStats(this.raffleId).subscribe({
      next: (res) => this.stats = res,
      error: () => console.error('Error loading stats')
    });
  }

  executeDraw() {
    if (this.drawForm.invalid) return;
    this.isDrawing = true;
    this.drawError = '';
    this.drawSuccessMessage = '';

    const winning_number = Number(this.drawForm.value.winning_number);

    this.raffleService.executeDraw(this.raffleId, { winning_number }).subscribe({
      next: (res) => {
        this.isDrawing = false;
        this.drawSuccessMessage = res.message || 'Se ha establecido el número ganador exitosamente. La rifa ha finalizado.';
        // Re-load data to reflect winner and status
        this.loadData(); 
        setTimeout(() => this.drawSuccessMessage = '', 7000);
      },
      error: (err) => {
        this.isDrawing = false;
        this.drawError = err.message || err.error?.message || 'Hubo un error al ejecutar el sorteo.';
      }
    });
  }
}
