import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { RaffleListComponent } from './features/raffles/raffle-list/raffle-list.component';
import { RaffleFormComponent } from './features/raffles/raffle-form/raffle-form.component';
import { RaffleDetailComponent } from './features/raffles/raffle-detail/raffle-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'raffles', component: RaffleListComponent },
      { path: 'raffles/new', component: RaffleFormComponent },
      { path: 'raffles/:id', component: RaffleDetailComponent },
      { path: 'raffles/:id/edit', component: RaffleFormComponent },
      { 
        path: 'partners', 
        loadComponent: () => import('./features/partners/pages/partner-list/partner-list.component').then(m => m.PartnerListComponent) 
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
