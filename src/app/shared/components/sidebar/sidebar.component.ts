import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 hidden md:block fixed">
      <div class="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <h1 class="text-xl font-bold text-primary-600 dark:text-primary-400">Toro Admin</h1>
      </div>
      <nav class="p-4 space-y-2">
        <a routerLink="/dashboard" routerLinkActive="bg-gray-100 dark:bg-gray-700 text-primary-600" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
        <a routerLink="/raffles" routerLinkActive="bg-gray-100 dark:bg-gray-700 text-primary-600" class="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Rifas</a>
      </nav>
    </aside>
  `
})
export class SidebarComponent {}
