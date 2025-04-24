import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Order {
  _id?: string;
  customerId?: string;
  paymentMethod?: string;
  orderType?: string;
  status?: string;
  address?: {
    city?: string;
    street?: string;
    gov?: string;
    zipCode?: string;
  };
  phone?: string;
  products?: {
    productId?: string;
    productName?: string;
    productImages?: { filePath: string }[];
    price?: number;
    totalPrice?: number;
    requiredQty?: number;
  }[];
  totalPrice?: number;
  totalQty?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
  styles  : [`.badge {
    padding: 5px 10px;
    border-radius: 50% !important;
  }`]
})
export class CustomerOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<{ success: boolean; data: any }>('http://localhost:7777/orders/customer/my/orders').subscribe({
      next: (response) => {
        this.orders = response.data.orders;
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
      }
    });
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal')!);
    modal.show();
  }
}