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
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-black tracking-tighter uppercase text-slate-100">Vista <span class="text-indigo-400">General</span></h2>
        <a routerLink="/raffles" class="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition flex items-center gap-2">Ver todas <i class="fa-solid fa-arrow-right"></i></a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <!-- Welcome Widget -->
         <div class="glass-card rounded-[2rem] p-10 col-span-1 md:col-span-2 lg:col-span-3 relative overflow-hidden group">
             <div class="absolute -top-32 -right-32 w-64 h-64 bg-indigo-600/30 blur-3xl rounded-full"></div>
             <h3 class="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">Sobre de Fortuna <span class="text-transparent bg-clip-text" style="background-image: var(--gold-gradient)">Digital</span></h3>
             <p class="text-slate-400 text-sm md:text-base font-light max-w-2xl">Gestiona tus colecciones, supervisa los activos digitales y decide el destino de la Fortuna. El éxito es tu decisión.</p>
         </div>

         <!-- Loader -->
         <div *ngIf="isLoading" class="col-span-full py-20 flex justify-center">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
         </div>

         <!-- Active Raffles Cards -->
         <ng-container *ngIf="!isLoading">
           <div *ngFor="let raf of recentRaffles" class="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[100px] -z-10 group-hover:bg-indigo-500/20 transition-colors"></div>
              
              <div class="z-10">
                 <div class="flex items-center justify-between mb-6">
                    <span [ngClass]="{
                       'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': raf.status === 'active',
                       'bg-slate-800 text-slate-400 border border-slate-700': raf.status !== 'active'
                    }" class="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                        {{ raf.status || 'Active' }}
                    </span>
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID-{{ raf.id | number:'3.0-0' }}</span>
                 </div>
                 <h3 class="text-2xl font-black text-white mb-4 tracking-tight leading-none">{{ raf.name }}</h3>
                 
                 <div class="space-y-2 mb-6">
                    <p class="text-xs text-slate-400 uppercase tracking-widest font-bold flex justify-between">Volumen <span class="text-white">{{ raf.number_to }} IDs</span></p>
                    <p class="text-xs text-slate-400 uppercase tracking-widest font-bold flex justify-between">Valor  <span class="text-yellow-500">{{ raf.ticket_price | currency }}</span></p>
                 </div>
                 
                 <!-- Error fallback safe check -->
                 <div *ngIf="raf.winner_ticket" class="mt-4 inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-xl text-sm font-black tracking-widest">
                    <i class="fa-solid fa-crown mr-2"></i> {{ raf.winner_ticket }}
                 </div>
              </div>
              
              <a [routerLink]="['/raffles', raf.id]" class="mt-8 w-full py-4 glass-nav text-center text-white border border-white/10 hover:bg-white/10 rounded-2xl transition-all text-xs font-black uppercase tracking-widest z-10">
                 Ingresar a Bóveda
              </a>
           </div>

           <div *ngIf="recentRaffles.length === 0" class="col-span-full text-center py-24 glass-card rounded-[3rem] border border-dashed border-white/20">
               <div class="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-6 text-2xl"><i class="fa-solid fa-folder-open"></i></div>
               <p class="text-slate-400 mb-8 font-light text-lg">Su bóveda está completamente vacía.</p>
               <a routerLink="/raffles/new" class="inline-flex items-center px-8 py-4 btn-premium text-white rounded-2xl font-black text-xs uppercase tracking-widest">Acuñar primer activo</a>
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
