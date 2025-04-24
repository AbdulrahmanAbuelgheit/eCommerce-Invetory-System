import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RequestDetailsDialogComponent } from './request-details-dialog/request-details-dialog.component';
import { PartialApprovalDialogComponent } from './partial-approval-dialog/partial-approval-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-requests',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.scss'],
})
export class AdminRequestsComponent implements OnInit {
  requests: any[] = [];
  displayedColumns: string[] = ['manager', 'branch', 'status', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.requests);
  }

  ngOnInit(): void {
    this.fetchRequests();
  }

  // Fetch requests from the API
  fetchRequests(): void {
    this.http.get('http://localhost:7777/requests').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.requests = response.data;
          this.dataSource = new MatTableDataSource(this.requests);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Failed to fetch requests:', err);
      },
    });
  }

  // Apply filter to the table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Get CSS class for status chip
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  // Open the details dialog
  openDetailsDialog(request: any): void {
    this.dialog.open(RequestDetailsDialogComponent, {
      width: '600px',
      data: request,
    });
  }

  // Approve all products in the request
  approveAll(requestId: string): void {
    this.http.put(`http://localhost:7777/requests/${requestId}/approve-all`, {}).subscribe({
      next: () => {
        this.fetchRequests(); // Refresh the list
      },
      error: (err) => {
        console.error('Failed to approve all:', err);
      },
    });
  }

  // Reject all products in the request
  rejectAll(requestId: string): void {
    const payload = {
      adminResponse: 'Insufficient stock available', // Include the adminResponse in the payload
    };

    this.http.put(`http://localhost:7777/requests/${requestId}/reject`, payload).subscribe({
      next: () => {
        this.fetchRequests(); // Refresh the list
      },
      error: (err) => {
        console.error('Failed to reject all:', err);
      },
    });
  }

  // Open the partial approval dialog
  openPartialApprovalDialog(request: any): void {
    const dialogRef = this.dialog.open(PartialApprovalDialogComponent, {
      width: '600px',
      data: request,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http
          .put(`http://localhost:7777/requests/${request._id}/approve-partial`, result)
          .subscribe({
            next: () => {
              this.fetchRequests(); // Refresh the list
            },
            error: (err) => {
              console.error('Failed to approve partially:', err);
            },
          });
      }
    });
  }
}