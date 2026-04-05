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
    <div class="space-y-6 max-w-3xl mx-auto">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? 'Editar Rifa' : 'Nueva Rifa' }}
        </h2>
        <a routerLink="/raffles" class="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          &larr; Volver
        </a>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form [formGroup]="raffleForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <!-- Name -->
             <div class="md:col-span-2">
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Rifa</label>
                <input id="name" formControlName="name" type="text" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
             </div>

             <!-- Type -->
             <div>
                <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Rifa</label>
                <select id="type" formControlName="type" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
                    <option value="product">Producto</option>
                    <option value="money">Dinero</option>
                </select>
             </div>

             <!-- Prize Description -->
             <div class="md:col-span-1">
                <label for="prize_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Premio a Entregar</label>
                <input id="prize_description" formControlName="prize_description" type="text" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
             </div>

             <!-- Description -->
             <div class="md:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Condiciones / Descripción Corta</label>
                <textarea id="description" formControlName="description" rows="2" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"></textarea>
             </div>

             <!-- Price (ticket_price) -->
             <div>
                <label for="ticket_price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio por Boleto ($)</label>
                <input id="ticket_price" formControlName="ticket_price" type="number" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
             </div>

             <!-- Total Tickets (number_to) -->
             <div>
                <label for="number_to" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad Total de Boletos</label>
                <input id="number_to" formControlName="number_to" type="number" min="1" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
             </div>

             <!-- End Date (draw_at) -->
             <div>
                <label for="draw_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Planificada del Sorteo</label>
                <input id="draw_at" formControlName="draw_at" type="datetime-local" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
             </div>

             <!-- Image Path Upload -->
             <div>
                <label for="image_path" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Banner o Imagen Promocional</label>
                <!-- Thumbnail Preview -->
                <div *ngIf="fullImageUrl && !selectedFile" class="mt-2 mb-3">
                   <img [src]="fullImageUrl" alt="Vista previa de la Rifa" class="h-32 object-contain rounded-md border border-gray-200 dark:border-gray-600 shadow-sm" />
                   <p class="text-xs text-gray-400 mt-1">Imagen actual registrada.</p>
                </div>
                <input id="image_path" type="file" (change)="onFileSelected($event)" accept="image/png, image/jpeg, image/jpg, image/webp" class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100">
             </div>
          </div>

          <div *ngIf="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/30 p-4 border border-green-200 dark:border-green-800 mb-4">
             <div class="text-sm text-green-700 dark:text-green-400 font-medium">{{ successMessage }}</div>
          </div>

          <div *ngIf="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/30 p-4 border border-red-200 dark:border-red-800 mb-4">
             <div class="text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap">{{ errorMessage }}</div>
          </div>

          <div class="flex justify-end pt-4">
             <button type="submit" [disabled]="raffleForm.invalid || isSaving" class="inline-flex justify-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors">
               {{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Rifa' : 'Crear Rifa') }}
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
            const errs = Object.values(err.error.errors).flat().join('\n');
            this.errorMessage = errs;
        } else {
            this.errorMessage = err.error?.message || err.message || 'Error grave al comunicarse con el servidor.';
        }
      }
    });
  }
}
