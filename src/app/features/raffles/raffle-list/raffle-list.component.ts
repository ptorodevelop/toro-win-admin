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
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-black tracking-tighter uppercase text-slate-100">Catálogo de <span class="text-indigo-400">Sobres</span></h2>
        <a routerLink="/raffles/new" class="btn-premium text-white font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-2xl transition-all flex items-center gap-2">
          <i class="fa-solid fa-plus"></i> Nueva Colección
        </a>
      </div>

      <div class="glass-card rounded-[2rem] overflow-hidden border border-white/10">
        <div *ngIf="isLoading" class="p-20 flex justify-center">
           <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>

        <div class="overflow-x-auto custom-scroll">
          <table *ngIf="!isLoading && raffles.length > 0" class="min-w-full divide-y divide-white/5">
            <thead class="bg-black/20">
              <tr>
                <th scope="col" class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Colección</th>
                <th scope="col" class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Oferta (Tokens)</th>
                <th scope="col" class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Uni.</th>
                <th scope="col" class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th scope="col" class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let r of raffles" class="hover:bg-white/5 transition-colors group">
                <td class="px-8 py-6 whitespace-nowrap">
                   <div class="flex flex-col">
                     <span class="text-base font-black text-white tracking-tight">{{ r.name }}</span>
                     <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sorteo: {{ r.draw_at | date }}</span>
                   </div>
                </td>
                <td class="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-300">
                  {{ r.number_to }} IDs
                </td>
                <td class="px-8 py-6 whitespace-nowrap text-sm font-bold text-yellow-500">
                  {{ r.ticket_price | currency }}
                </td>
                <td class="px-8 py-6 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': r.status === 'active',
                    'bg-slate-800 text-slate-400 border border-slate-700': r.status !== 'active'
                  }" class="px-3 py-1 inline-flex text-[9px] font-black rounded-full uppercase tracking-widest">
                    {{ r.status || 'Active' }}
                  </span>
                  <span *ngIf="r.winner_ticket" class="ml-3 text-[10px] font-black text-yellow-500 uppercase tracking-widest inline-flex items-center gap-1">
                    <i class="fa-solid fa-crown"></i> {{ r.winner_ticket }}
                  </span>
                </td>
                <td class="px-8 py-6 whitespace-nowrap text-right text-xs font-black uppercase tracking-widest space-x-4">
                  <a [routerLink]="['/raffles', r.id]" class="text-indigo-400 hover:text-indigo-300 transition-colors">
                     Panel
                  </a>
                  <a [routerLink]="['/raffles', r.id, 'edit']" class="text-slate-400 hover:text-white transition-colors">
                     Ajustes
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && raffles.length === 0" class="p-20 text-center">
           <div class="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-6 text-2xl"><i class="fa-solid fa-folder-open"></i></div>
           <h3 class="mt-2 text-xl font-black text-white tracking-tight">Catálogo Vacío</h3>
           <p class="mt-2 text-sm text-slate-400 font-light mb-8">Comienza acuñando tu primera colección de activos.</p>
           <a routerLink="/raffles/new" class="inline-flex items-center gap-2 px-8 py-4 btn-premium text-white font-black text-xs uppercase tracking-widest rounded-2xl">
              <i class="fa-solid fa-plus"></i> Nueva Colección
           </a>
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
