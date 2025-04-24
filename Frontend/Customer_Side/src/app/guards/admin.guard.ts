// core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { StaffAuthService } from '../services/staff-auth.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(
    private auth: StaffAuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Get requirements from route data
    const requiredRoles = next.data['roles'] || [];
    const requiredPermissions = next.data['permissions'] || [];
    const currentUser = this.auth.getCurrentUser();

    // Authentication check
    if (!this.auth.isAuthenticated()) {
      return this.handleUnauthenticated(state.url);
    }

    // Role validation
    if (requiredRoles.length > 0 && !this.validateRoles(requiredRoles)) {
      return this.handleUnauthorized();
    }

    // Permission validation
    if (requiredPermissions.length > 0 && !this.validatePermissions(requiredPermissions)) {
      return this.handleUnauthorized();
    }

    // Branch validation (optional)
    if (next.data['requiredBranch'] && !this.validateBranch(next.data['requiredBranch'])) {
      return this.handleUnauthorized();
    }

    return true;
  }

  private validateRoles(requiredRoles: string[]): boolean {
    const userRole = this.auth.getCurrentRole();
    return requiredRoles.includes('*') || 
           requiredRoles.includes(userRole) ||
           (this.auth.isSuperAdmin() && requiredRoles.includes('admin'));
  }

  private validatePermissions(requiredPermissions: string[]): boolean {
    return requiredPermissions.every(p => 
      p === '*' || 
      
      this.auth.isSuperAdmin()
    );
  }

  private validateBranch(requiredBranch: string): boolean {
    const userBranch = this.auth.getCurrentBranch();
    const allowedBranches = this.auth.getAllowedBranches();
    
    return this.auth.isSuperAdmin() ||
           allowedBranches.includes('*') ||
           allowedBranches.includes(requiredBranch) ||
           userBranch === requiredBranch;
  }

  private handleUnauthenticated(returnUrl: string): UrlTree {
    const hasToken = !!localStorage.getItem(this.auth['tokenKey']); // Access via bracket notation
    
    if (hasToken) {
      this.auth.showSessionExpiredAlert();
    } else {
      this.auth.showAuthErrorAlert('Please login to access this page');
    }
    
    return this.router.createUrlTree(['/staff-login'], {
      queryParams: { returnUrl },
      queryParamsHandling: 'merge'
    });
  }

  private handleUnauthorized(): UrlTree {
    this.auth.showAuthErrorAlert('You don\'t have permission to access this resource');
    return this.router.createUrlTree(['/unauthorized']);
  }
}