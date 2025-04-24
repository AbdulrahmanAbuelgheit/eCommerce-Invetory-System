import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BranchDataService } from '@app/services/branch-data.service';

@Component({
  selector: 'app-manager-orders',
  imports: [CommonModule,FormsModule,DataTablesModule,NgbNavModule],
  templateUrl: './manager-orders.component.html',
  styleUrls: ['./manager-orders.component.scss'],
})
export class ManagerOrdersComponent implements OnInit {
  orders: any[] = [];
  pendingOnTheWayOrders: any[] = [];
  deliveredOrders: any[] = [];
  cancelledOrders: any[] = [];
  selectedOrder: any = null;

  branchId: string = '';
  branchName: string = '';


  constructor(private http: HttpClient, private modalService: NgbModal,private branchDataService: BranchDataService) {}

  ngOnInit(): void {
    this.fetchOrders();

    // Subscribe to branch data
    this.branchDataService.currentBranchId.subscribe(id => {
      if (id) {
        this.branchId = id;
      }
    });

    this.branchDataService.currentBranchName.subscribe(name => {
      this.branchName = name;
      console.log(this.branchName)
    });
  }

  // Fetch orders from the API
  fetchOrders(): void {
    this.http.get('http://localhost:7777/orders/branch/my/orders').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.orders = response.data;
          this.filterOrders();
        }
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
      },
    });
  }

  // Filter orders by status
  filterOrders(): void {
    this.pendingOnTheWayOrders = this.orders.filter(
      (order) => order.status === 'pending' || order.status === 'onTheWay' 
    );
    console.log(this.pendingOnTheWayOrders)
    this.deliveredOrders = this.orders.filter((order) => order.status === 'delivered');
    console.log(this.deliveredOrders);
    this.cancelledOrders = this.orders.filter((order) => order.status === 'cancelled');
  }

  // Open the "View Details" modal
  openViewDetailsModal(order: any, content: TemplateRef<any>): void {
    this.selectedOrder = order;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // Open the "Update Order" modal
  openUpdateOrderModal(order: any, content: TemplateRef<any>): void {
    this.selectedOrder = { ...order }; // Copy the selected order
    this.modalService.open(content, { centered: true });
  }

  // Update the order status
  updateOrderStatus(): void {
    const orderId = this.selectedOrder._id;
    this.http.put(`http://localhost:7777/orders/${orderId}`, { status: this.selectedOrder.status }).subscribe({
      next: () => {
        this.fetchOrders(); // Refresh the list
        this.modalService.dismissAll(); // Close the modal
      },
      error: (err) => {
        console.error('Failed to update order status:', err);
      },
    });
  }

  // Cancel an order
  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.http.put(`http://localhost:7777/orders/${orderId}/cancel`, {}).subscribe({
        next: () => {
          this.fetchOrders(); // Refresh the list
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
        },
      });
    }
  }
}