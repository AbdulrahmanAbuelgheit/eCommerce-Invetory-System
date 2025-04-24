import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AccountComponent } from './account/account.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CustomerOrdersComponent } from './account/customer-orders/customer-orders.component';
import { CustomerAuthGuard } from '@app/guards/customer-auth.guard';

export const mainRoutes: Routes = [
  { path: '', component: ProductsComponent },
  { 
    path: 'products/:id', 
    component: ProductDetailsComponent 
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'orders',
    component: CustomerOrdersComponent,
  }
];
