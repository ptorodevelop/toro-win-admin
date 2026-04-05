import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Raffle } from '../models/raffle.interface';
import { RaffleStats } from '../models/raffle-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class RaffleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/raffles`;

  getRaffles(): Observable<Raffle[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => {
        // Handle Laravel paginated or standard wrapper
        if (res.data && Array.isArray(res.data.data)) {
           return res.data.data;
        } else if (res.data && Array.isArray(res.data)) {
           return res.data;
        }
        return res;
      })
    );
  }

  getRaffle(id: number | string): Observable<Raffle> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
         if (res.data && res.data.data) return res.data.data;
         return res.data || res;
      })
    );
  }

  createRaffle(data: Raffle | FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, data).pipe(
      map(res => ({ message: res.message, data: res.data || res }))
    );
  }

  updateRaffle(id: number | string, data: Partial<Raffle> | FormData): Observable<any> {
    // If we use FormData for update, use POST with _method=PUT because PHP doesn't parse multipart form-data in PUT requests natively easily
    if (data instanceof FormData && !data.has('_method')) {
       data.append('_method', 'PUT');
    }
    const req$ = data instanceof FormData 
        ? this.http.post<any>(`${this.baseUrl}/${id}`, data)
        : this.http.put<any>(`${this.baseUrl}/${id}`, data);
        
    return req$.pipe(
      map(res => ({ message: res.message, data: res.data || res }))
    );
  }

  executeDraw(id: number | string, data: { winning_number: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/draw`, data).pipe(
       map(res => {
         if (res.status === false) {
           throw new Error(res.message || 'Operación denegada por el servidor.');
         }
         return { message: res.message, data: res.data || res };
       })
    );
  }

  getRaffleStats(id: number | string): Observable<RaffleStats> {
    return this.http.get<any>(`${this.baseUrl}/${id}/stats`).pipe(
      map(res => res.data || res)
    );
  }
}
