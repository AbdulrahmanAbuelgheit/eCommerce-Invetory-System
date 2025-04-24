import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@app/environments/environment';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface StaffTokenPayload {
  email: string;
  role: 'cashier' | 'manager' | 'super_admin' | 'seller';
  userType:'seller';
  exp: number;
  sub: string;
  branchId?: string;
  allowedBranches?: string[];
}


@Injectable({ providedIn: 'root' })
export class StaffAuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  loginStaff(credentials: { email: string; password: string }): Observable<StaffTokenPayload> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
        this.storeAuthToken(response.token);
        return this.decodeToken(response.token);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }
  

  getCurrentUser(): StaffTokenPayload | null {
    const token = localStorage.getItem(this.tokenKey);
    return token ? this.decodeToken(token) : null;
  }

  getCurrentRole(): string {
    console.log("ROLE");
    console.log(this.getCurrentUser())
    return this.getCurrentUser()?.role || '';
  }

  getCurrentType(): string {
    console.log("ROLE");
    console.log(this.getCurrentUser())
    return this.getCurrentUser()?.userType || '';
  }

  // hasPermission(permission: string): boolean {
  //   const user = this.getCurrentUser();
  //   console.log('User:', user); // Debugging
  //   console.log('User Permissions:', user?.permissions); // Debugging
  //   return user ? user.permissions.includes(permission) : false;
  // }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && !this.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/staff-login']);
    this.showLogoutSuccessAlert();
  }
  getCurrentBranch(): string | null {
    return this.getCurrentUser()?.branchId || null;
  }

  getAllowedBranches(): string[] {
    const user = this.getCurrentUser();
    return user?.allowedBranches || [user?.branchId].filter(Boolean) as string[];
  }

  isSuperAdmin(): boolean {
    return this.getCurrentRole() === 'super_admin';
  }

  isSeller(): boolean {
    return this.getCurrentRole() === 'seller';
  }
  isCashier(): boolean {
    return this.getCurrentType() === 'cashier';
  }
  // canManageRoles(): boolean {
  //   return this.hasPermission('role:write') || this.isSuperAdmin();
  // }
  
   storeAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  decodeToken(token: string): StaffTokenPayload {
    try {
      const decoded = jwtDecode<StaffTokenPayload>(token);
      console.log('Decoded Token:', decoded); // Debugging
      if ((!decoded.role&&!decoded.userType) || !decoded.exp) {
        throw new Error('Invalid token structure');
      }
      return decoded;
    } catch (error) {
      this.showInvalidTokenAlert();
      throw new Error('Invalid token format');
    }
  }

   isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }

   handleAuthError(error: HttpErrorResponse): Observable<never> {
    const status = error.status;
    const message = this.getErrorMessage(status);

    if (status === 401 || status === 403) {
      this.showAuthErrorAlert(message);
    } else if (status >= 500) {
      this.showServerErrorAlert();
    }
    return throwError(() => ({
      status,
      message,
      originalError: error
    }));
  }

   getErrorMessage(status: number): string {
    const messages: { [key: number]: string } = {
      400: 'Invalid request format',
      401: 'Invalid credentials',
      403: 'Insufficient permissions',
      404: 'Account not found',
      429: 'Too many attempts - try again later',
      500: 'Server error - please try again later',
      503: 'Service unavailable'
    };

    return messages[status] || 'Authentication failed. Please try again.';
  }
  

   showAuthErrorAlert(message: string): void {
    Swal.fire({
      title: 'Authentication Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#3f51b5',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-button'
      }
    });
  }

   showServerErrorAlert(): void {
    Swal.fire({
      title: 'Server Error',
      text: 'We\'re experiencing technical difficulties. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#3f51b5',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-button'
      }
    });
  }

   showSessionExpiredAlert(): void {
    Swal.fire({
      title: 'Session Expired',
      text: 'Please login again to continue',
      icon: 'warning',
      confirmButtonColor: '#3f51b5',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-button'
      }
    }).then(() => {
      this.logout();
      window.location.reload();
    });
  }

   showInvalidTokenAlert(): void {
    Swal.fire({
      title: 'Invalid Session',
      text: 'Your session is invalid. Please login again.',
      icon: 'error',
      confirmButtonColor: '#3f51b5',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-button'
      }
    }).then(() => {
      this.logout();
      window.location.reload();
    });
  }

  private showLogoutSuccessAlert(): void {
    Swal.fire({
      title: 'Logged Out',
      text: 'You have been successfully logged out',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: '#1a1a2e',
      color: '#fff'
    });
  }
  
}