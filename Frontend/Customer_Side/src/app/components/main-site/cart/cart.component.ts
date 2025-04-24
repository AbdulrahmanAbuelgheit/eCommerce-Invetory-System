// src/app/components/cart/cart.component.ts
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ICartItem } from '@app/models/cart-item';
import Swal from 'sweetalert2';
import { AuthService } from '@app/services/auth-service.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  constructor(){}
  cartService = inject(CartService);
  @Input() showActions = true;

  onQuantityChange(item: ICartItem, event: Event): void {
    const newQuantity = parseInt((event.target as HTMLInputElement).value);
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item._id, newQuantity);
    }
  }

  clearCart(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to clear the cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
      }
    });
  }

}