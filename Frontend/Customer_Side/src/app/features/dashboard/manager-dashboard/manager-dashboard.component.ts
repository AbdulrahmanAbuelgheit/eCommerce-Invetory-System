import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
} from '@ng-bootstrap/ng-bootstrap';
import { ManagerSideNavComponent } from "./manager-side-nav/manager-side-nav.component";

@Component({
  selector: 'app-manager-dashboard.component.ts',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    ManagerSideNavComponent
],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.scss',
})
export class ManagerDashboardComponent {

  // sidenav collapse component
    collapsed = signal(false);
  
    sidenavwidth = computed(() => this.collapsed() ? '64px' : '240px');
  menuItems = [
    {
      path: '/manager-dashboard/staff',
      icon: 'bi-people',
      label: 'Staff Management',
    },
    {
      path: '/manager-dashboard/inventory',
      icon: 'bi-boxes',
      label: 'Inventory',
    },
    {
      path: '/manager-dashboard/customers',
      icon: 'bi-people',
      label: 'Customers',
    },
  ];
}
