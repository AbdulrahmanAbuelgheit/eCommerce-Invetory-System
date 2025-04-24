import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ProfileInfoComponent } from "./profile-info/profile-info.component";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';


export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ProfileInfoComponent , MatListModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  // Sidenav collapse property to control the content width
  sidenavCollapsed = signal(false);
  @Input() set collapsed(val:boolean) {
    this.sidenavCollapsed.set(val);
  }



  // Menu items
  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'receipt_long',
      label: 'MakeOrder',
      route: 'order'
    },
    {
      icon: 'shopping_cart',
      label: 'Products',
      route: 'seller-products'
    },
    {
      icon: 'account_circle',
      label: 'All Orders',
      route: 'seller-orders'
    }
  ]


}