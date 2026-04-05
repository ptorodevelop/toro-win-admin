import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="h-20 glass-nav flex items-center justify-between px-8 w-full z-10 transition-colors duration-200">
      <div class="flex items-center">
        <!-- Hamburger Menu for Mobile -->
        <button class="md:hidden text-slate-400 hover:text-white mr-4 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <span class="text-sm font-black tracking-widest uppercase text-slate-400 hidden sm:block">Centro de <span class="text-white">Operaciones</span></span>
      </div>
      <div class="flex items-center space-x-6">
        <div class="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 shadow-xl cursor-pointer hover:text-white hover:border-indigo-500 transition">
           <i class="fa-solid fa-user"></i>
        </div>
        <button (click)="logout()" class="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition flex items-center gap-2">
          Cerrar Sesión <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </header>
  `
})
export class TopbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
