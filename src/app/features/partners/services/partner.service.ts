import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Partner {
  id?: number;
  name: string;
  document: string | null;
  phone: string | null;
  code: string;
  commission_type: 'fixed' | 'percentage';
  commission_value: number;
  is_active: boolean;
  total_sales_amount?: number;
  total_orders?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/partners`;

  getPartners(raffleId?: number): Observable<{status: boolean, message: string, data: Partner[]}> {
    const url = raffleId ? `${this.apiUrl}?raffle_id=${raffleId}` : this.apiUrl;
    return this.http.get<{status: boolean, message: string, data: Partner[]}>(url);
  }

  createPartner(partner: Partial<Partner>): Observable<{status: boolean, message: string, data: Partner}> {
    return this.http.post<{status: boolean, message: string, data: Partner}>(this.apiUrl, partner);
  }

  updatePartner(id: number, partner: Partial<Partner>): Observable<{status: boolean, message: string, data: Partner}> {
    return this.http.put<{status: boolean, message: string, data: Partner}>(`${this.apiUrl}/${id}`, partner);
  }
}
