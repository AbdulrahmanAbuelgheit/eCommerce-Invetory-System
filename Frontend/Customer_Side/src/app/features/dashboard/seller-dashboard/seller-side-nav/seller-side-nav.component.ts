import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/services/auth-service.service';
import { SellerService } from '@app/services/seller.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}


@Component({
  selector: 'app-seller-side-nav',
  imports: [CommonModule , MatListModule, MatIconModule,MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './seller-side-nav.component.html',
  styleUrl: './seller-side-nav.component.scss'
})
export class SellerSideNavComponent {

  
   
    constructor(private http: HttpClient, private router: Router, private authService:AuthService,sellerService:SellerService) { }
    ngOnInit(): void {
      
      this.getSellerData().subscribe(
        (response) => {
          this.profileData = response.data; // Update profileData with API response
          
        },
        (error) => {
          console.error('Error fetching seller data:', error);
        }
      );
    }
      profileData : any ;
  
      // Sidenav collapse property to control the content width
      sidenavCollapsed = signal(false);
      @Input() set collapsed(val:boolean) {
        this.sidenavCollapsed.set(val);
      }
  
      profilePicSize = computed(() => this.sidenavCollapsed() ? '42' : '100');
      
    
      //Get Profile Data
  
      getSellerData(): Observable<any> {
          return this.http.get(`http://localhost:7777/sellers/my/profile`);
        }
  
    
    
      // Menu items
      menuItems: MenuItem[] = [
        
        {
          icon: 'dashboard',
          label: 'Dashboard',
          route: 'analysis'
        },
        {
          icon: 'list_alt',
          label: 'All Orders',
          route: 'orders'
        },
        {
          icon: 'inventory_2',
          label: 'Products',
          route: 'products'
        }
      ]
      async logout() {
        try {
        await this.authService.logout();
        Swal.fire({
          icon: 'success',
          title: 'Logged out successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/staff-login']);
        } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Logout failed',
          text: 'Please try again'
        });
        }
      }

}
