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
    <div *ngIf="raffle; else loading" class="space-y-8">
      
      <!-- Header Area -->
      <div class="flex items-center justify-between">
        <div>
           <h2 class="text-3xl md:text-5xl font-black tracking-tighter text-white">{{ raffle.name }}</h2>
           <p class="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">
              Estado Operativo: 
              <span [ngClass]="{
                 'text-emerald-400': raffle.status === 'active',
                 'text-slate-500': raffle.status !== 'active'
              }" class="ml-2">
                 {{ raffle.status || 'Desconocido' }}
              </span>
           </p>
        </div>
        <a routerLink="/raffles" class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition flex items-center gap-2">
           <i class="fa-solid fa-arrow-left"></i> Retornar
        </a>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Revenue Card -->
        <div class="glass-card rounded-[2rem] p-8 border-t-2 border-t-yellow-500">
           <h3 class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Recaudación</h3>
           <p class="text-3xl font-black text-white tracking-tighter text-transparent bg-clip-text" style="background-image: var(--gold-gradient)">
             {{ stats?.revenue_total | currency:'USD' }}
           </p>
        </div>
        <!-- Sold Cards -->
        <div class="glass-card rounded-[2rem] p-8 border-t-2 border-t-indigo-500">
           <h3 class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Tokens Generados</h3>
           <p class="text-3xl font-black text-white tracking-tighter">
             {{ stats?.tickets_sold }} <span class="text-sm text-slate-500 font-light tracking-normal">/ {{ stats?.tickets_total || raffle.number_to }}</span>
           </p>
        </div>
        <!-- Available -->
        <div class="glass-card rounded-[2rem] p-8 border-t-2 border-t-emerald-500">
           <h3 class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Tokens Disponibles</h3>
           <p class="text-3xl font-black text-white tracking-tighter">
             {{ stats?.tickets_available }}
           </p>
        </div>
        <!-- Progress -->
        <div class="glass-card rounded-[2rem] p-8 border-t-2 border-t-purple-500">
           <h3 class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Penetración</h3>
           <p class="text-3xl font-black text-white tracking-tighter">
             {{ stats?.percentage_sold! / 100 | percent:'1.1-2' }}
           </p>
           <div class="w-full bg-white/10 rounded-full h-1 mt-4">
             <div class="bg-gradient-to-r from-purple-600 to-indigo-500 h-1 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" [style.width.%]="stats?.percentage_sold"></div>
           </div>
        </div>
      </div>

      <!-- Action Area: Draw Winner -->
      <div class="mt-12 glass-card rounded-[2.5rem] p-10 relative overflow-hidden">
        <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none"></div>
        <h3 class="text-2xl font-black text-white mb-6 tracking-tight uppercase">Protocolo de Asignación</h3>
        
        <div *ngIf="raffle.winner_ticket; else drawFormTpl" class="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 inline-block">
           <p class="text-yellow-500 font-black tracking-widest text-sm flex items-center gap-3">
             <i class="fa-solid fa-crown text-2xl"></i> 
             <span>Token Seleccionado: <span class="text-3xl ml-2">{{ raffle.winner_ticket }}</span></span>
           </p>
        </div>

        <ng-template #drawFormTpl>
          <p class="text-slate-400 mb-8 font-light max-w-xl">
             Ingrese el identificador ganador validado por el sistema externo. Esta acción clausulará el activo digital de forma permanente y auditable.
          </p>
          <form [formGroup]="drawForm" (ngSubmit)="executeDraw()" class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
             <div class="flex-1 w-full sm:max-w-xs">
                <label for="winning_number" class="sr-only">ID Ganador</label>
                <input id="winning_number" type="number" min="0" formControlName="winning_number" placeholder="ID (Ej. 102)"
                   class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-6 py-4 border border-white/10 outline-none transition-all">
                <div *ngIf="drawForm.get('winning_number')?.touched && drawForm.get('winning_number')?.invalid" class="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-2">
                   Entrada inválida
                </div>
             </div>
             <button type="submit" [disabled]="drawForm.invalid || isDrawing"
                class="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 btn-premium rounded-2xl text-white font-black text-[10px] uppercase tracking-widest">
                <svg *ngIf="isDrawing" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <i *ngIf="!isDrawing" class="fa-solid fa-lock mr-2"></i>
                {{ isDrawing ? 'Validando...' : 'Sellar Destino' }}
             </button>
          </form>
          
          <div *ngIf="drawSuccessMessage" class="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/30 mt-6 inline-block">
             <div class="text-[10px] text-emerald-400 font-black tracking-widest uppercase">{{ drawSuccessMessage }}</div>
          </div>
          <div *ngIf="drawError" class="rounded-xl bg-red-500/10 p-4 border border-red-500/30 mt-6 inline-block">
             <div class="text-[10px] text-red-400 font-black tracking-widest uppercase">{{ drawError }}</div>
          </div>
        </ng-template>

      </div>

    </div>

    <ng-template #loading>
      <div class="flex justify-center items-center h-64">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
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
