import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RaffleService } from '../../../core/services/raffle.service';
import { Raffle } from '../../../core/models/raffle.interface';

@Component({
  selector: 'app-raffle-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Lista de Rifas</h2>
        <a routerLink="/raffles/new" class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          + Nueva Rifa
        </a>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div *ngIf="isLoading" class="p-6 flex justify-center">
           <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <table *ngIf="!isLoading && raffles.length > 0" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rifa
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Boletos
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr *ngFor="let r of raffles" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                 <div class="flex flex-col">
                   <span>{{ r.name }}</span>
                   <span class="text-xs text-gray-400 font-normal">Sorteo: {{ r.draw_at | date }}</span>
                 </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ r.number_to }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ r.ticket_price | currency }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span [ngClass]="{
                  'bg-green-100 text-green-800': r.status === 'active',
                  'bg-gray-100 text-gray-800': r.status !== 'active'
                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide">
                  {{ r.status || 'Active' }}
                </span>
                <span *ngIf="r.winner_ticket" class="ml-2 text-xs font-bold text-primary-600 block sm:inline mt-1 sm:mt-0">
                  🏆 {{ r.winner_ticket }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <a [routerLink]="['/raffles', r.id]" class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                   Panel
                </a>
                <a [routerLink]="['/raffles', r.id, 'edit']" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                   Editar
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div *ngIf="!isLoading && raffles.length === 0" class="p-12 text-center">
           <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
           </svg>
           <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay Rifas</h3>
           <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comienza creando tu primera Rifa.</p>
           <div class="mt-6">
              <a routerLink="/raffles/new" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                 + Nueva Rifa
              </a>
           </div>
        </div>

      </div>
    </div>
  `
})
export class RaffleListComponent implements OnInit {
  private raffleService = inject(RaffleService);
  
  raffles: Raffle[] = [];
  isLoading = true;

  ngOnInit() {
    this.raffleService.getRaffles().subscribe({
      next: (data) => {
        this.raffles = data;
        this.isLoading = false;
      },
      error: () => {
        console.error('Error fetching raffles');
        this.isLoading = false;
      }
    });
  }
}
