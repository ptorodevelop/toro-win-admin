import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnerService, Partner } from '../../services/partner.service';
import { PartnerFormModalComponent } from '../../components/partner-form-modal/partner-form-modal.component';
import { RaffleService } from '../../../../core/services/raffle.service';

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PartnerFormModalComponent],
  templateUrl: './partner-list.component.html'
})
export class PartnerListComponent implements OnInit {
  partners: Partner[] = [];
  raffles: any[] = [];
  selectedRaffle: number | '' = '';
  isModalOpen = false;
  selectedPartner: Partner | null = null;
  
  private readonly partnerService = inject(PartnerService);
  private readonly raffleService = inject(RaffleService);

  ngOnInit() {
    this.loadRaffles();
    this.loadPartners();
  }

  loadRaffles() {
    this.raffleService.getRaffles().subscribe({
      next: (res: any) => {
        this.raffles = res;
      },
      error: (err: any) => console.error(err)
    });
  }

  loadPartners() {
    const raffleId = this.selectedRaffle !== '' ? Number(this.selectedRaffle) : undefined;
    this.partnerService.getPartners(raffleId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.partners = res.data;
        }
      },
      error: (err: any) => console.error(err)
    });
  }

  onRaffleChange() {
    this.loadPartners();
  }

  openModal(partner?: Partner) {
    this.selectedPartner = partner || null;
    this.isModalOpen = true;
  }

  closeModal(refresh: boolean = false) {
    this.isModalOpen = false;
    this.selectedPartner = null;
    if (refresh) {
      this.loadPartners();
    }
  }

  calculateCommission(partner: Partner): number {
    const totalSales = Number(partner.total_sales_amount) || 0;
    if (partner.commission_type === 'percentage') {
      return totalSales * (Number(partner.commission_value) / 100);
    }
    const totalOrders = Number(partner.total_orders) || 0;
    return Number(partner.commission_value) * totalOrders;
  }
}
