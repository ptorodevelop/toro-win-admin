import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="flex h-screen bg-transparent">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col md:ml-64 overflow-hidden">
        <app-topbar></app-topbar>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 custom-scroll">
          <div class="max-w-7xl mx-auto">
             <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {}
