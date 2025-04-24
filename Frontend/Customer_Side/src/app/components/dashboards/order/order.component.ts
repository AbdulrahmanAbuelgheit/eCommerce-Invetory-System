import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cashier-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  productId: string = '';
  product: Product | null = null;
  selectedQuantity: number = 1;
  orderItems = new MatTableDataSource<OrderItem>([]);
  displayedColumns: string[] = ['product', 'quantity', 'price', 'total', 'actions'];

  // Mock product data (replace with API call)
  products: Product[] = [
    { id: '123', name: 'Product A', price: 19.99, quantity: 10 },
    { id: '456', name: 'Product B', price: 29.99, quantity: 5 }
  ];

  searchProduct(): void {
    this.product = this.products.find(p => p.id === this.productId) || null;
    if (this.product) {
      this.selectedQuantity = 1;
    }
  }

  addToOrder(): void {
    if (this.product && this.selectedQuantity) {
      const newItem: OrderItem = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.selectedQuantity
      };
      
      // Add new item to data source
      this.orderItems.data = [...this.orderItems.data, newItem];
      
      // Reset product search
      this.product = null;
      this.productId = '';
    }
  }

  removeItem(index: number): void {
    const data = this.orderItems.data;
    data.splice(index, 1);
    this.orderItems.data = data; // Trigger update
  }

  getOrderTotal(): number {
    return this.orderItems.data.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  trackByFn(index: number, item: OrderItem): string {
    return item.id;
  }

  submitOrder(): void {
    console.log('Order Submitted:', this.orderItems.data);
    // Add API call here
    this.orderItems.data = [];
  }
}
