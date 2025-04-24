import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '@app/services/auth-service.service';
import { StaffAuthService } from '@app/services/staff-auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthGuard implements CanActivate {
  constructor(private router: Router, private authService:StaffAuthService ) {}
    
  

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken');

    const decoded = this.authService.decodeToken(token!);



    if (decoded.userType=='seller'||decoded.userType=='staff') {
      return false;
    }

    // Redirect to login if no token
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}