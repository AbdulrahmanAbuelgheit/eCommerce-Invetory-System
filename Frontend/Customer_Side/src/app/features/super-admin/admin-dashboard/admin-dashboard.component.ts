import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { StaffAuthService } from '@app/services/staff-auth.service'; // Import the service

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
  badge?: string;
};

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgbDropdownModule, NgbTooltip, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class AdminDashboardComponent {
  // Sidenav collapse property to control the content width
  sidenavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sidenavCollapsed.set(val);
  }

  // Menu items
  menuItems: MenuItem[] = [
    { icon: 'speedometer', label: 'Dashboard', route: 'dashboard' },
    { icon: 'box-seam', label: 'Products', route: 'products' },
    { icon: 'diagram-3', label: 'Categories', route: 'categories' },
    { icon: 'building', label: 'Branches', route: 'branches' },
    { icon: 'arrow-left-right', label: 'Stock Transfer', route: 'stock-transfer' },
    { icon: 'person-badge', label: 'Managers', route: 'managers' },
    { icon: 'people', label: 'Cashiers', route: 'cashiers' },
    { icon: 'shop', label: 'Sellers', route: 'sellers' },
    { icon: 'people', label: 'Customers', route: 'customers' },
    { icon: 'people', label: 'Requests', route: 'requests' },

  ];

  isMobile = false;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private staffAuthService: StaffAuthService // Inject the service
  ) {}

  ngAfterViewInit() {
    this.checkMobile();
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => this.checkMobile());
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 992;
    if (this.isMobile) {
      this.sidenavCollapsed.set(true);
    }
  }

  toggleMenu() {
    this.sidenavCollapsed.set(!this.sidenavCollapsed());
  }

  async logout() {
    const result = await Swal.fire({
      title: 'Session Management',
      html: `<p class="text-muted">Are you sure you want to end your current session?</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn btn-danger px-4',
        cancelButton: 'btn btn-secondary px-4'
      },
      buttonsStyling: false,
      showClass: { popup: 'animate_animated animate_fadeInDown' },
      hideClass: { popup: 'animate_animated animate_fadeOutUp' }
    });

    if (result.isConfirmed) {
      // Call the logout method from StaffAuthService
      this.staffAuthService.logout();
    }
  }
}