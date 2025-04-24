import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboards/dashboard/dashboard.component';
import { MainSiteComponent } from './components/main-site/main-site.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { SignupComponent } from './components/Auth/signup/signup.component';
import { StaffLoginComponent } from './components/Auth/staff-login/staff-login.component';
import { ManagerDashboardComponent } from './features/dashboard/manager-dashboard/manager-dashboard.component';
import { AdminDashboardComponent } from './features/super-admin/admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './features/dashboard/seller-dashboard/seller-dashboard.component';
import { AdminAuthGuard } from './guards/admin.guard';
import { ManagerAuthGuard } from './guards/manager.guard.guard';
import { CustomerAuthGuard } from './guards/customer-auth.guard';
import { SellerAuthGuard } from './guards/seller.guard';
import { CashierComponent } from './features/dashboard/cashier/cashier.component';
import { CashierAuthGuard } from './guards/cashier.guard';

export const routes: Routes = [
  {
    path: '',
    
    component: MainSiteComponent,
    // canActivate: [CustomerAuthGuard],
    
    loadChildren: () =>
      import('./components/main-site/main-site.routes').then(
        (m) => m.mainRoutes
      ),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'staff-login',
    component: StaffLoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },

  {
    path: 'dash',
    component: DashboardComponent,
    loadChildren: () =>
      import('./components/dashboards/dashboard.routes').then(
        (m) => m.dashRoutes
      ),
  },
  { 
    path: 'manager-dashboard',
    component: ManagerDashboardComponent,
    canActivate: [ManagerAuthGuard],
    children: [
      { path: 'orders', loadComponent: () => import('./features/dashboard/manager-dashboard/manager-orders/manager-orders.component').then(m => m.ManagerOrdersComponent) },
      { path: 'staff', loadComponent: () => import('./features/dashboard/manager-dashboard/manager-staff/manager-staff.component').then(m => m.ManagerStaffComponent) },
      { path: 'new-order', loadComponent: () => import('./components/cashier-order/cashier-order.component').then(m => m.CashierOrderComponent) },
      { path: 'inventory', loadComponent: () => import('./features/dashboard/manager-dashboard/manager-inventory/manager-inventory.component').then(m => m.ManagerInventoryComponent) },
      { path: 'request', loadComponent: () => import('./features/dashboard/manager-dashboard/manager-make-request/manager-make-request.component').then(m => m.ManagerMakeRequestComponent) },
      { path: 'requests', loadComponent: () => import('./features/dashboard/manager-dashboard/manager-requests/manager-requests.component').then(m => m.ManagerRequestsComponent) },
      { path: '', redirectTo: 'manager-dashboard', pathMatch: 'full' }
    ]
  },
  { 
    path: 'seller-dashboard',
    component: SellerDashboardComponent,
    canActivate: [SellerAuthGuard],
    children: [
      { path: 'orders', loadComponent: () => import('./features/dashboard/seller-dashboard/seller-orders/seller-orders.component').then(m => m.SellerOrdersComponent) },
      { path: '', loadComponent: () => import('./features/dashboard/seller-dashboard/seller-dash/seller-dash.component').then(m => m.SellerDashComponent) },
      { path: 'analysis', loadComponent: () => import('./features/dashboard/seller-dashboard/seller-dash/seller-dash.component').then(m => m.SellerDashComponent) },
      { path: 'products', loadComponent: () => import('./features/dashboard/seller-dashboard/seller-products/seller-products.component').then(m => m.SellerProductsComponent) },
    ]
  },
  { 
    path: 'cashier',
    component: CashierComponent,
    canActivate: [CashierAuthGuard],
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/cashier/cashier.component').then(m => m.CashierComponent) },
    ]
  },
  {
    path: 'super-admin',
    component: AdminDashboardComponent,
    canActivate: [AdminAuthGuard],
    data: {
      roles: ['super_admin'],
    },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('@app/features/super-admin/dashboard-analytics/dashboard-analytics.component')
            .then(m => m.DashboardAnalyticsComponent),
        data: { section: 'Analytics Dashboard' }
      },
     
      {
        path: 'cashiers',
        loadComponent: () => import('@app/features/super-admin/cashiers/cashier-list.component.ts/cashier-list.component')
          .then(m => m.CashierListComponent),
        data: { section: 'Cashier Management' }
      },
      {
        path: 'customers',
        loadComponent: () => import('@app/features/super-admin/customers/customer-list/customer-list.component')
          .then(m => m.CustomerListComponent),
        data: { section: 'Customer Management' }
      },
      {
        path: 'managers',
        loadComponent: () => import('@app/features/super-admin/managers/manager-list/manager-list.component')
          .then(m => m.ManagerListComponent),
        data: { section: 'Manager Management' }
      },
      {
        path: 'sellers',
        loadComponent: () => import('@app/features/super-admin/sellers/seller-list/seller-list.component')
          .then(m => m.SellerListComponent),
        data: { section: 'Seller Management' }
      },
      {
        path: 'branches',
        loadComponent: () => import('@app/features/super-admin/branch-management/branch-management.component')
          .then(m => m.BranchManagementComponent),
        data: { section: 'Branch Management' }
      },
      {
        path: 'products',
        loadComponent: () => import('@app/features/super-admin/product/product-lis/product-list.component').then(m => m.ProductListComponent),
        data: { section: 'Product Management' }
      },
      {
        path: 'categories',
        loadComponent: () => import('@app/features/super-admin/category/category-list/category-list.component').then(m => m.CategoryListComponent),
        data: { section: 'Category Management' }
      },
      {
        path: 'requests',
        loadComponent: () => import('@app/features/super-admin/admin-requests/admin-requests.component').then(m => m.AdminRequestsComponent),
        data: { section: 'Requests Managment' }
      },
      {
        path: 'stock-transfer',
        loadComponent: () => import('@app/features/super-admin/stock-transfer/stock-transfer.component').then(m => m.StockTransferComponent),
        data: { section: 'Stock Transfer' }
      },
      {
        path: 'products/new',
        loadComponent: () => import('@app/features/super-admin/product/product-form/product-form.component').then(m => m.ProductFormComponent),
        data: { section: 'New Product' }
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('@app/features/super-admin/product/product-form/product-form.component').then(m => m.ProductFormComponent),
        data: { section: 'Edit Product' }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
