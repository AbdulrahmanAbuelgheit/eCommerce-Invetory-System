import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RequestDetailsDialogComponent } from './request-details-dialog/request-details-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-requests',
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
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './manager-requests.component.html',
  styleUrls: ['./manager-requests.component.scss'],
})
export class ManagerRequestsComponent implements OnInit {
  requests: any[] = [];
  displayedColumns: string[] = [
    'createdAt',
    'totalProducts',
    'status',
    'actions',
  ];
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
    this.http.get('http://localhost:7777/requests/my-requests').subscribe({
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
}
