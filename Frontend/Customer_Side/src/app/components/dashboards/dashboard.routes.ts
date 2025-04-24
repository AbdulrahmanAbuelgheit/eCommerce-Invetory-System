import { Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { CashierOrderComponent } from '../cashier-order/cashier-order.component';
import { SellerDashboardComponent } from '../seller-dashboard/seller-dashboard.component';
import { SellerProductsComponent } from '../seller-products/seller-products.component';
import { SellerOrdersComponent } from '../seller-orders/seller-orders.component';
export const dashRoutes: Routes = [
  {
     path: '',
     pathMatch: 'full',
      redirectTo: 'dashboard' 
  },
  {
    path: 'dashboard',
    component:SellerDashboardComponent
  },
  {
    path: 'order',
    component: CashierOrderComponent
  },
  {
    path: 'seller-products',
    component: SellerProductsComponent
  },
  {
    path: 'seller-orders',
    component: SellerOrdersComponent
  }
  
  
];
