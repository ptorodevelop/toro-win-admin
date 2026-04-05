import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 h-screen glass-nav hidden md:flex flex-col fixed z-20">
      <div class="h-20 flex items-center justify-center border-b border-white/5">
        <div class="flex items-center gap-3 cursor-pointer">
           <div class="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
               <i class="fa-solid fa-gem text-sm"></i>
           </div>
           <span class="text-lg font-black tracking-tighter uppercase text-slate-100">Toro<span class="text-indigo-400">Admin</span></span>
        </div>
      </div>
      <nav class="flex-1 p-6 space-y-3 custom-scroll">
        <a routerLink="/dashboard" routerLinkActive="bg-white/10 text-white font-bold border-indigo-500" class="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all">
          <i class="fa-solid fa-chart-pie"></i> Cuadro de Mando
        </a>
        <a routerLink="/raffles" routerLinkActive="bg-white/10 text-white font-bold border-indigo-500" class="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all">
          <i class="fa-solid fa-ticket"></i> Catálogo de Sobres
        </a>
      </nav>
      <div class="p-6 border-t border-white/5 text-center">
        <p class="text-[9px] font-black uppercase tracking-widest text-slate-500">© 2026 Sobre de Fortuna Digital Premium</p>
      </div>
    </aside>
  `
})
export class SidebarComponent {}
