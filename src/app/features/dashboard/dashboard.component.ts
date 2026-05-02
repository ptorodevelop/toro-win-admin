import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RaffleService } from '../../core/services/raffle.service';
import { Raffle } from '../../core/models/raffle.interface';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private raffleService = inject(RaffleService);
  recentRaffles: Raffle[] = [];
  isLoading = true;
  
  // Tabs state
  selectedTab: 'analytics' | 'catalog' = 'analytics';

  // Analytics
  activeRaffleStats: any = null;
  activeRaffle: Raffle | null = null;
  revenuePercent: string = '0';
  
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('ticketsChart') ticketsChartRef!: ElementRef;
  
  revenueChartInstance: Chart | null = null;
  ticketsChartInstance: Chart | null = null;

  ngOnInit() {
    this.raffleService.getRaffles().subscribe({
      next: (data: Raffle[]) => {
        this.recentRaffles = data.slice(0, 6);
        this.isLoading = false;
        
        // Find if there is an active raffle to show charts
        this.activeRaffle = data.find(r => r.status === 'active') || null;
        if (this.activeRaffle && this.activeRaffle.id) {
           this.loadActiveRaffleStats(this.activeRaffle.id!);
        } else {
           // Si no hay rifa activa, saltar al catálogo por defecto
           this.selectedTab = 'catalog';
        }
      },
      error: () => {
        this.isLoading = false;
        console.error('Failed fetching raffles for dashboard');
      }
    });
  }
  
  switchTab(tab: 'analytics' | 'catalog') {
     this.selectedTab = tab;
     if (tab === 'analytics' && this.activeRaffleStats) {
        setTimeout(() => this.initCharts(), 50);
     }
  }

  loadActiveRaffleStats(id: number | string) {
    this.raffleService.getRaffleStats(id).subscribe({
       next: (stats) => {
          this.activeRaffleStats = stats;
          // Render charts initial load only if we are in analytics tab
          if(this.selectedTab === 'analytics') {
             setTimeout(() => this.initCharts(), 100);
          }
       },
       error: () => console.error('Error fetching raffle stats for analytics')
    });
  }
  
  initCharts() {
     if (!this.revenueChartRef || !this.ticketsChartRef || !this.activeRaffle) return;
     
     if (this.revenueChartInstance) this.revenueChartInstance.destroy();
     if (this.ticketsChartInstance) this.ticketsChartInstance.destroy();
     
     // ─── Revenue Chart ───────────────────────────────────────────────
     // Usar percentage_revenue del backend — ya fue calculado con las mismas unidades
     // en RaffleStatsService: (revenue_total / revenue_goal) * 100
     const revPctFromBackend = Number(this.activeRaffleStats?.percentage_revenue || 0);
     const cappedPct = Math.min(revPctFromBackend, 100);
     this.revenuePercent = cappedPct.toFixed(1);

     // Para el donut: porción vendida vs porción pendiente (en % para que no importen las unidades)
     const chartEarned  = cappedPct;
     const chartPending = Math.max(100 - cappedPct, 0);

     this.revenueChartInstance = new Chart(this.revenueChartRef.nativeElement, {
        type: 'doughnut',
        data: {
           labels: ['Recaudado', 'Por Recaudar'],
           datasets: [{
              data: [chartEarned, chartPending > 0 ? chartPending : 0.001],
              backgroundColor: ['#f59e0b', '#1e293b'],
              borderColor:     ['#d97706', '#0f172a'],
              borderWidth: 2,
              hoverOffset: 6
           }]
        },
        options: {
          cutout: '78%',
          responsive: true,
          maintainAspectRatio: true,
          animation: { animateRotate: true, duration: 900 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderWidth: 1,
              titleColor: '#f8fafc',
              bodyColor: '#94a3b8',
              callbacks: {
                label: (ctx: any) => ` ${ctx.label}: ${Number(ctx.raw).toFixed(1)}%`
              }
            }
          }
        }
     });

     // ─── Tickets Chart ───────────────────────────────────────────────
     const sold      = Number(this.activeRaffleStats?.tickets_sold     || 0);
     const reserved  = Number(this.activeRaffleStats?.tickets_reserved || 0);
     const available = Number(this.activeRaffleStats?.tickets_available || 0);

     this.ticketsChartInstance = new Chart(this.ticketsChartRef.nativeElement, {
        type: 'doughnut',
        data: {
           labels: ['Vendidos', 'Reservados', 'Disponibles'],
           datasets: [{
              data: [sold, reserved, available > 0 ? available : 0.001],
              backgroundColor: ['#6366f1', '#f59e0b', '#1e293b'],
              borderColor:     ['#4338ca', '#d97706', '#0f172a'],
              borderWidth: 2,
              hoverOffset: 6
           }]
        },
        options: {
          cutout: '78%',
          responsive: true,
          maintainAspectRatio: true,
          animation: { animateRotate: true, duration: 900 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderWidth: 1,
              titleColor: '#f8fafc',
              bodyColor: '#94a3b8',
            }
          }
        }
     });
  }
}
