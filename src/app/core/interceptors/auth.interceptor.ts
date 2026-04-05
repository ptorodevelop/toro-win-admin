import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // For /api/admin/ endpoints, inject the Sanctum Bearer token
  if (token && req.url.includes('/api/admin')) {
    const clonedReq = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
    });
    return next(clonedReq);
  } else if (!token && req.url.includes('/api/admin')) {
    console.warn(`[Auth Interceptor] WARNING: No token found in localStorage for ${req.url}`);
  }

  // Fallback, just ensure Accept application/json is present anyway for Laravel
  const clonedReq = req.clone({
     headers: req.headers.set('Accept', 'application/json')
  });
  return next(clonedReq);
};
