import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <!-- Glow Background -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div class="glass-card max-w-md w-full p-10 rounded-[2.5rem] relative z-10 transition-transform duration-700 hover:scale-[1.01]">
        <div class="text-center">
          <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl border border-white/10">
            <i class="fa-solid fa-gem text-3xl"></i>
          </div>
          <h2 class="mt-2 text-center text-4xl font-black tracking-tighter text-white uppercase">
            Acceso <span class="text-indigo-400">Premium</span>
          </h2>
          <p class="mt-4 text-center text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text" style="background-image: var(--gold-gradient)">
          Sobre de Fortuna Digital
          </p>
        </div>
        
        <form class="mt-10 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
             <div>
                <label for="email" class="sr-only">Correo Electrónico</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fa-solid fa-envelope text-slate-500"></i>
                  </div>
                  <input id="email" formControlName="email" type="email" autocomplete="email" required 
                    class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-12 pr-6 py-4 border border-white/10 outline-none transition-all" placeholder="Correo Electrónico oficial">
                </div>
             </div>
             <div>
                <label for="password" class="sr-only">Contraseña</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fa-solid fa-lock text-slate-500"></i>
                  </div>
                  <input id="password" formControlName="password" type="password" autocomplete="current-password" required 
                    class="block w-full rounded-2xl bg-black/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-12 pr-6 py-4 border border-white/10 outline-none transition-all" placeholder="Clave de autenticación">
                </div>
             </div>
          </div>

          <div *ngIf="errorMessage" class="rounded-xl bg-red-500/10 p-4 border border-red-500/30 text-center text-xs font-bold text-red-400 tracking-widest uppercase mt-4">
             <i class="fa-solid fa-triangle-exclamation mr-2"></i> {{ errorMessage }}
          </div>

          <div class="pt-2">
            <button type="submit" [disabled]="loginForm.invalid || isLoading"
              class="w-full flex justify-center items-center py-4 px-4 btn-premium rounded-2xl text-white font-black text-xs uppercase tracking-widest disabled:opacity-50 transition-all shadow-xl">
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <i *ngIf="!isLoading" class="fa-solid fa-shield-halved mr-2 text-lg"></i>
              {{ isLoading ? 'Validando Biometría...' : 'Desbloquear Bóveda' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Footer estético -->
      <div class="absolute bottom-6 w-full text-center pointer-events-none">
         <p class="text-[9px] font-black uppercase tracking-widest text-slate-600">© 2026 Plataforma Sobre de Fortuna Digital</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Credenciales inválidas o error en el servidor.';
          this.isLoading = false;
        }
      });
    }
  }
}
