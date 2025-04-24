import { Routes } from '@angular/router';
import { CashierListComponent } from './cashiers/cashier-list.component.ts/cashier-list.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { ManagerListComponent } from './managers/manager-list/manager-list.component';
import { SellerListComponent } from './sellers/seller-list/seller-list.component';
import { BranchManagementComponent } from './branch-management/branch-management.component';
import { ProductListComponent } from './product/product-lis/product-list.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { ProductFormComponent } from './product/product-form/product-form.component';


export const dashRoutes: Routes = [
    {
       path: '',
       pathMatch: 'full',
        redirectTo: 'dashboard' 
    },
    {
      path: 'cashiers',
      component:CashierListComponent
    },
    {
      path: 'customers',
      component: CustomerListComponent
    },
    {
      path: 'managers',
      component: ManagerListComponent
    },
    {
      path: 'sellers',
      component: SellerListComponent
    }
    ,
    {
      path: 'branches',
      component: BranchManagementComponent
    }
    ,
    {
      path: 'products',
      component: ProductListComponent
    }
    ,
    {
      path: 'categories',
      component: CategoryListComponent
    }
    
    ,
    {
      path: 'stock-transfer',
      component: StockTransferComponent
    }
    ,
    {
      path: 'products/new',
      component: ProductFormComponent
    }
    
    ,
    {
      path: 'products/edit/:id',
      component: ProductFormComponent
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
  ];
  