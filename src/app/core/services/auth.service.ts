import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (token) {
      if (userString && userString !== 'undefined') {
        try {
          this.userSubject.next(JSON.parse(userString));
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
      // If there is a token, the user is authenticated. 
      // Do not logout just because the user info is missing.
    } else {
      // Clean up any potential corrupted state if token is missing
      if (userString) {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, credentials).pipe(
      tap(response => {
        const tokenToSave = response.token || response.access_token;
        if (tokenToSave) {
          localStorage.setItem('token', tokenToSave);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        } else {
          console.warn('[Auth Service] Login successful but no token or access_token found in response:', response);
        }
      })
    );
  }

  logout(): void {
    // Assuming backend endpoint exists for logout: `${environment.apiUrl}/logout`
    // this.http.post(`${environment.apiUrl}/logout`, {}).subscribe();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
