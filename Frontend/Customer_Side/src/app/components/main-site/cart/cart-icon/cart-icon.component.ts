import { Component, inject } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule,MatBadgeModule],
  template: `
  <button  mat-icon-button matBadge="{{ cartService.cartItems().length }}" class="cart">
    <mat-icon class="mat-small">shopping_cart</mat-icon>
  </button>
    
  `,
  styleUrl: './cart-icon.component.scss'
})
export class CartIconComponent {
  cartService = inject(CartService);
}