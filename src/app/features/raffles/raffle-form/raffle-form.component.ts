import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RaffleService } from '../../../core/services/raffle.service';
import { Raffle } from '../../../core/models/raffle.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-raffle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="space-y-8 max-w-4xl mx-auto">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-black tracking-tighter uppercase text-white">
          {{ isEditing ? 'Configurar' : 'Crear' }} <span class="text-indigo-400">Sorteo Digital</span>
        </h2>
        <a routerLink="/raffles" class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition flex items-center gap-2">
           <i class="fa-solid fa-arrow-left"></i> Retornar
        </a>
      </div>

      <div class="glass-card rounded-[2.5rem] p-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <form [formGroup]="raffleForm" (ngSubmit)="onSubmit()" class="space-y-8 relative z-10">
          
           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <!-- Name -->
             <div class="md:col-span-2">
                <label for="name" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Denominación Oficial</label>
                <input id="name" formControlName="name" type="text" class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-6 py-4 border border-white/10 outline-none transition-all">
             </div>

             <!-- Type -->
             <div>
                <label for="type" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Clase de Activo</label>
                <select id="type" formControlName="type" class="block w-full rounded-2xl bg-black/80 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-6 py-4 border border-white/10 outline-none transition-all cursor-pointer">
                    <option value="product">Bien Físico</option>
                    <option value="money">Capital</option>
                </select>
             </div>

             <!-- Prize Description -->
             <div class="md:col-span-1">
                <label for="prize_description" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Garantía / Premio</label>
                <input id="prize_description" formControlName="prize_description" type="text" class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-6 py-4 border border-white/10 outline-none transition-all">
             </div>

             <!-- Description -->
             <div class="md:col-span-2">
                <label for="description" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Condiciones Particulares</label>
                <textarea id="description" formControlName="description" rows="3" class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-6 py-4 border border-white/10 outline-none transition-all custom-scroll"></textarea>
             </div>

             <!-- Price (ticket_price) -->
             <div>
                <label for="ticket_price" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cotización por Token ($)</label>
                <input id="ticket_price" formControlName="ticket_price" type="number" min="0" step="0.01" class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-6 py-4 border border-white/10 outline-none transition-all">
             </div>

             <!-- Total Tickets (number_to) -->
             <div>
                <label for="number_to" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Volumen de Emisión</label>
                <input id="number_to" formControlName="number_to" type="number" min="1" class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-6 py-4 border border-white/10 outline-none transition-all">
             </div>

             <!-- End Date (draw_at) -->
             <div class="md:col-span-2">
                <label for="draw_at" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Programación del Sorteo</label>
                <input id="draw_at" formControlName="draw_at" type="datetime-local" class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-6 py-4 border border-white/10 outline-none transition-all [color-scheme:dark]">
             </div>

             <!-- Image Path Upload -->
             <div class="md:col-span-2">
                <label for="image_path" class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Arte Promocional Oficial</label>
                <!-- Thumbnail Preview -->
                <div *ngIf="fullImageUrl && !selectedFile" class="mt-2 mb-6 p-4 rounded-3xl border border-white/10 bg-black/20 text-center relative max-w-sm mx-auto overflow-hidden">
                   <div class="absolute inset-0 bg-indigo-500/5 z-0"></div>
                   <img [src]="fullImageUrl" alt="Vista previa de la Rifa" class="h-40 object-contain rounded-xl shadow-2xl relative z-10 mx-auto" />
                </div>
                <div class="relative w-full">
                     <input id="image_path" type="file" (change)="onFileSelected($event)" accept="image/png, image/jpeg, image/jpg, image/webp" 
                       class="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-indigo-500 file:transition-all file:cursor-pointer cursor-pointer border border-white/5 rounded-2xl bg-black/20 p-2">
                </div>
             </div>
           </div>

           <div *ngIf="successMessage" class="rounded-2xl bg-emerald-500/10 p-6 border border-emerald-500/30">
             <div class="text-[10px] text-emerald-400 font-black tracking-widest uppercase"><i class="fa-solid fa-check-circle mr-2"></i> {{ successMessage }}</div>
           </div>

           <div *ngIf="errorMessage" class="rounded-2xl bg-red-500/10 p-6 border border-red-500/30">
             <div class="text-xs font-bold text-red-400 whitespace-pre-wrap"><i class="fa-solid fa-triangle-exclamation mr-2"></i> {{ errorMessage }}</div>
           </div>

           <div class="flex justify-end pt-8 border-t border-white/10">
              <button type="submit" [disabled]="raffleForm.invalid || isSaving" class="inline-flex justify-center items-center px-10 py-5 btn-premium shadow-xl rounded-2xl text-white font-black text-xs uppercase tracking-widest disabled:opacity-50 transition-all">
                <i *ngIf="!isSaving" class="fa-solid fa-floppy-disk mr-3 text-lg"></i>
                <svg *ngIf="isSaving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isSaving ? 'Guardando Registro...' : (isEditing ? 'Sellar Cambios' : 'Acuñar Oficialmente') }}
              </button>
           </div>

        </form>
      </div>
    </div>
  `
})
export class RaffleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private raffleService = inject(RaffleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditing = false;
  isSaving = false;
  raffleId: string | null = null;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;
  fullImageUrl: string | null = null;

  raffleForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    type: ['product', Validators.required],
    description: [''],
    prize_description: ['', Validators.required],
    ticket_price: [0, [Validators.required, Validators.min(0)]],
    number_from: [1], // Usually defaults to 1
    number_to: [100, [Validators.required, Validators.min(1)]],
    draw_at: ['', Validators.required]
  });

  ngOnInit() {
    this.raffleId = this.route.snapshot.paramMap.get('id');
    if (this.raffleId) {
      this.isEditing = true;
      this.loadRaffle(this.raffleId);
    }
  }

  loadRaffle(id: string) {
    this.raffleService.getRaffle(id).subscribe({
      next: (r: any) => {
        // format dates suitable for datetime-local input
        const safeFormatDate = (d: string) => d ? new Date(d).toISOString().slice(0, 16) : '';
        
        if (r.image_path) {
           // We derive the storage URL from the apiUrl (e.g. replacing /api with /storage/)
           const baseStorageUrl = environment.apiUrl.replace(/\/api\/?$/, '/storage/');
           this.fullImageUrl = baseStorageUrl + r.image_path;
        }

        this.raffleForm.patchValue({
          name: r.name,
          type: r.type || 'product',
          description: r.description,
          prize_description: r.prize_description,
          ticket_price: r.ticket_price,
          number_from: r.number_from || 1,
          number_to: r.number_to,
          draw_at: safeFormatDate(r.draw_at)
        });
      },
      error: () => this.errorMessage = 'No se pudo cargar la rifa'
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.raffleForm.invalid) {
       this.errorMessage = 'Por favor completa todos los campos requeridos.';
       return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Utilizando FormData para soportar la subida del archivo (image_path) y los inputs de texto
    const formData = new FormData();
    const formVals = this.raffleForm.value;

    Object.keys(formVals).forEach(key => {
      formData.append(key, formVals[key]);
    });

    if (this.selectedFile) {
       // La API rule para el input dice req->file('image_path')
       formData.append('image_path', this.selectedFile);
    }
    
    // Si estamos editando y usando FormData, a veces Laravel requiere un spoffing "_method=PUT"
    if (this.isEditing) {
       formData.append('_method', 'PUT');
    }

    const obs$ = this.isEditing 
      ? this.raffleService.updateRaffle(this.raffleId!, formData)
      : this.raffleService.createRaffle(formData);

    obs$.subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = res.message || 'La rifa se guardó exitosamente.';
        // Wait gracefully so the user reads the message before leaving
        setTimeout(() => this.router.navigate(['/raffles']), 1800);
      },
      error: (err) => {
        this.isSaving = false;
        // Transformar Laravel Validation Error a un mensaje legible
        if (err.error?.errors) {
            const errs = Object.values(err.error.errors).flat().join('\\n');
            this.errorMessage = errs;
        } else {
            this.errorMessage = err.error?.message || err.message || 'Error grave al comunicarse con el servidor.';
        }
      }
    });
  }
}
