import { Component, Input, signal } from '@angular/core';


export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-main-dashboard',
  imports: [],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss'
})
export class MainDashboardComponent {

  // Sidenav collapse property to control the content width
  sidenavCollapsed = signal(false);
  @Input() set collapsed(val:boolean) {
    this.sidenavCollapsed.set(val);
  }



  // Menu items
  menuItems: MenuItem[] = [
    {
      icon: 'cahsier',
      label: 'Cashiers',
      route: 'cashiers'
    },
    {
      icon: 'customers',
      label: 'Customers',
      route: 'customers'
    },
    {
      icon: 'managers',
      label: 'Managers',
      route: 'managers'
    },
    {
      icon: 'sellers',
      label: 'Sellers',
      route: 'sellers'
    },
    {
      icon: 'branches',
      label: 'Branches',
      route: 'branches'
    },
    {
      icon: 'products',
      label: 'Products',
      route: 'products'
    },
    {
      icon: 'categories',
      label: 'Categories',
      route: 'categories'
    },
    {
      icon: 'stock-transfer',
      label: 'Stock Transfer',
      route: 'transfer'
    },
    {
      icon: 'Products',
      label: 'Products',
      route: 'products/new'
    },
    {
      icon: 'stock-transfer',
      label: 'Stock Transfer',
      route: 'transfer'
    },
  ]


}
