import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

interface Product {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantityAvailable: number;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderResponse {
  success: boolean;
  data: any;
}


@Component({
  selector: 'app-cashier',
  imports: [CommonModule,FormsModule,MatIconModule,MatButtonModule,MatToolbarModule],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.scss',
})
export class CashierComponent {
  constructor(private router: Router, private authService: AuthService , private http: HttpClient, private modalService: NgbModal) {}

  productId: string = '';
    product: Product | null = null;
    selectedQuantity: number = 1;
    orderItems: OrderItem[] = [];
    customerName: string = '';
    phone: string = '';
    paymentMethod: string = 'Cash';
  

  
    searchProduct(): void {
      const url = 'http://localhost:7777/orders/add-product';
      const body = { productId: this.productId };
  
      this.http.post<{ success: boolean; data: Product }>(url, body).subscribe({
        next: (response) => {
          this.product = response.data;
        },
        error: (err) => {
          console.error('Failed to fetch product:', err);
          this.product = null;
        },
      });
    }
  
    addToOrder(): void {
      if (this.product && this.selectedQuantity) {
        this.orderItems.push({
          productId: this.product.productId,
          name: this.product.name,
          price: this.product.price,
          quantity: this.selectedQuantity,
        });
        this.product = null;
        this.productId = '';
      }
    }
  
    removeFromOrder(itemId: string): void {
      this.orderItems = this.orderItems.filter((item) => item.productId !== itemId);
    }
  
    getOrderTotal(): number {
      return this.orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }
  
    submitOrder(): void {
      const orderData = {
        customerName: this.customerName,
        phone: this.phone,
        paymentMethod: this.paymentMethod,
        products: this.orderItems.map((item) => ({
          productId: item.productId,
          requiredQty: item.quantity,
        })),
      };
      console.log('Order Data:', orderData);
  
      this.http
        .post<OrderResponse>('http://localhost:7777/orders/offline', orderData)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.generateReceipt(response.data);
            }
          },
          error: (err) => {
            console.error('Failed to submit order:', err);
          },
        });
    }
  
    generateReceipt(order: any): void {
      const receiptContent = `
        <h2>Order Receipt</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Customer Name:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <h3>Products</h3>
        <ul>
          ${order.products
            .map(
              (product: any) => `
            <li>${product.productName} - ${product.requiredQty} x ${
                product.price
              } = ${product.requiredQty * product.price}</li>
          `
            )
            .join('')}
        </ul>
        <h3>Total: ${order.totalPrice}</h3>
      `;
  
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(receiptContent);
      newWindow?.document.close();
      newWindow?.print();
    }



  //logout
  async logout() {
    try {
      await this.authService.logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged out successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigate(['/staff-login']);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout failed',
        text: 'Please try again',
      });
    }
  }
}
