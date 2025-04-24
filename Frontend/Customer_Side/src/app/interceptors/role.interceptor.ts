// core/interceptors/role.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StaffAuthService } from '../services/staff-auth.service';
import { inject } from '@angular/core';

interface TokenClaims {
  role: string;
  branchId?: string;
  sub: string;
  permissions: string[];
}

export const roleInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(StaffAuthService);
  const token = localStorage.getItem('authToken');
  
  let claims: Partial<TokenClaims> = {};
  
  if (token) {
    try {
      claims = jwtDecode<TokenClaims>(token);
    } catch {
      authService.showInvalidTokenAlert();
      return throwError(() => new Error('Invalid token'));
    }
  }

  const modifiedReq = req.clone({
    setHeaders: {
    //   'X-User-Role': claims.role || '',
    //   'X-Branch-Id': claims.branchId || '',
    //   'X-User-Id': claims.sub || '',
      Authorization: `Bearer ${token}` 
    }
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        authService.showAuthErrorAlert(
          error.error?.message || 'Action not permitted for your role'
        );
      }
      return throwError(() => error);
    })
  );
};