// core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StaffAuthService } from '@app/services/staff-auth.service';

@Injectable({
  providedIn: 'root'
})
export class CashierAuthGuard implements CanActivate {
  constructor(
    private authService: StaffAuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isAuthenticated() && this.authService.getCurrentRole() === 'cashier') {
      return true;
    }
    
    // Handle different error cases
    if (!this.authService.isAuthenticated()) {
      this.authService.showSessionExpiredAlert();
    } else if (this.authService.getCurrentRole() !== 'cashier') {
      this.authService.showAuthErrorAlert('Insufficient privileges');
    }

    // Redirect to login with return URL
    this.router.navigate(['/staff-login'], { 
      queryParams: { returnUrl: state.url },
      replaceUrl: true
    });
    return false;
  }
}