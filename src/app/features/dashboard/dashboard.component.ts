import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RaffleService } from '../../core/services/raffle.service';
import { Raffle } from '../../core/models/raffle.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Panel General</h2>
        <a routerLink="/raffles" class="text-sm font-medium text-primary-600 hover:text-primary-500">Ver todas &rarr;</a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <!-- Welcome Widget -->
         <div class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow p-6 text-white col-span-1 md:col-span-2 lg:col-span-3">
             <h3 class="text-2xl font-bold">¡Bienvenido al Panel de Producción!</h3>
             <p class="mt-2 text-primary-100">Gestiona tus rifas, ventas y descubre los ganadores en muy simples pasos. Revisa la tabla de recursos más recientes.</p>
         </div>

         <!-- Loader -->
         <div *ngIf="isLoading" class="col-span-full py-12 flex justify-center">
             <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
         </div>

         <!-- Active Raffles Cards -->
         <ng-container *ngIf="!isLoading">
           <div *ngFor="let raf of recentRaffles" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
              <div>
                 <div class="flex items-center justify-between mb-4">
                    <span [ngClass]="{
                       'bg-green-100 text-green-800': raf.status === 'active',
                       'bg-gray-100 text-gray-800': raf.status !== 'active'
                    }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide">
                        {{ raf.status || 'Active' }}
                    </span>
                    <span class="text-xs text-gray-400 font-mono">{{ raf.id }}</span>
                 </div>
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ raf.name }}</h3>
                 <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Boletos: <span class="font-bold text-gray-700 dark:text-gray-200">{{ raf.number_to }}</span></p>
                 <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Precio/u: <span class="font-bold text-gray-700 dark:text-gray-200">{{ raf.ticket_price | currency }}</span></p>
                 
                 <!-- Error fallback safe check -->
                 <div *ngIf="raf.winner_ticket" class="mt-3 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-bold">
                    Ganador: {{ raf.winner_ticket }}
                 </div>
              </div>
              
              <a [routerLink]="['/raffles', raf.id]" class="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-primary-500 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md transition-colors text-sm font-semibold">
                 Abrir Detalles y Sorteo
              </a>
           </div>

           <div *ngIf="recentRaffles.length === 0" class="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-dashed border-gray-300 dark:border-gray-600">
               <p class="text-gray-500 dark:text-gray-400 mb-4">Aún no hay rifas activas en la plataforma.</p>
               <a routerLink="/raffles/new" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Crear mi primera Rifa</a>
           </div>
         </ng-container>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private raffleService = inject(RaffleService);
  recentRaffles: Raffle[] = [];
  isLoading = true;

  ngOnInit() {
    // Ideally we would fetch to a generic list, limiting down to e.g. 6 items
    this.raffleService.getRaffles().subscribe({
      next: (data: Raffle[]) => {
        this.recentRaffles = data.slice(0, 6);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Failed fetching raffles for dashboard');
      }
    });
  }
}
