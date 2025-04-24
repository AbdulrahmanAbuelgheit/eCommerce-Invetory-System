import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '@app/services/seller.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule,FormsModule,DataTablesModule],
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.scss']
})
export class SellerOrdersComponent implements OnInit {
  sellerOrders: any[] = [];
  selectedOrder: any = null;

  //DataTables variable
  dtOptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

  constructor(private sellerService: SellerService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [
        {
          targets: 0, // First column (index)
          searchable: false,
          orderable: true,
          render: function (data: any, type: any, full: any, meta: any) {
            return meta.row + 1; // Row index + 1 for human-readable numbering
          }
        }
      ]
    };
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.sellerService.getDashboardData().subscribe({
      next: (response) => {
        this.sellerOrders = response.data.sellerOrders;
        
        this.dttrigger.next(null);
        
      },
      error: (err) => {
        console.error('Failed to fetch dashboard data:', err);
      }
    });
  }

  openOrderDetails(order: any): void {
    this.selectedOrder = order;
    const modal =new bootstrap.Modal(document.getElementById('orderDetailsModal')!);
    modal.show();
  }
}