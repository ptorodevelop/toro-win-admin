import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-6 w-full z-10 transition-colors duration-200">
      <div class="flex items-center">
        <!-- Optional Hamburger Menu for Mobile -->
        <button class="md:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <span class="text-lg font-medium">Panel Administrativo</span>
      </div>
      <div class="flex items-center space-x-4">
        <button (click)="logout()" class="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">
          Cerrar Sesión
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
