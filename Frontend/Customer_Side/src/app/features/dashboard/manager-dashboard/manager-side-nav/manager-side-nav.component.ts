import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/services/auth-service.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { BranchDataService } from '@app/services/branch-data.service';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-manager-side-nav',
  imports: [CommonModule , MatListModule, MatIconModule,MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './manager-side-nav.component.html',
  styleUrl: './manager-side-nav.component.scss'
})
export class ManagerSideNavComponent implements OnInit {


 
  constructor(private http: HttpClient, private router: Router, private authService:AuthService, private branchDataService: BranchDataService) { }
  ngOnInit(): void {
    
    this.getManagerData().subscribe(
      (response) => {
        this.profileData = response.data; // Update profileData with API response
        this.branchId = this.profileData.branchId._id;
        this.branchName = this.profileData.branchId.name;
        localStorage.setItem('branchName', JSON.stringify(this.profileData.branchId.name));
        localStorage.setItem('branchId', JSON.stringify(this.profileData.branchId._id));
        // Update the service with branch data
        this.branchDataService.updateBranchData(this.branchName, this.branchId);

      },
      (error) => {
        console.error('Error fetching manager data:', error);
      }
    );
  }
  
  branchName : any;
  branchId : any;
    profileData : any ;

    // Sidenav collapse property to control the content width
    sidenavCollapsed = signal(false);
    @Input() set collapsed(val:boolean) {
      this.sidenavCollapsed.set(val);
    }

    profilePicSize = computed(() => this.sidenavCollapsed() ? '42' : '100');
    
  
    //Get Profile Data

    getManagerData(): Observable<any> {
        return this.http.get(`http://localhost:7777/managers/my/profile`);
      }

  
  
    // Menu items
    menuItems: MenuItem[] = [
      {
        icon: 'receipt_long',
        label: 'New Order',
        route: 'new-order'
      },
      {
        icon: 'badge',
        label: 'Staff Management',
        route: 'staff'
      },
      {
        icon: 'list_alt',
        label: 'All Orders',
        route: 'orders'
      },
      {
        icon: 'inventory_2',
        label: 'Inventory',
        route: 'inventory'
      },
      {
        icon: 'edit_document',
        label: 'Make Request',
        route: 'request'
      },
      {
        icon: 'rule',
        label: 'All Requests',
        route: 'requests'
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
    //logout() {
      //localStorage.clear(); // Clear local storage
     // this.authService.logout(); // Logout the user
      //this.router.navigate(['/login']); // Navigate to the login page
    //}
  

}
