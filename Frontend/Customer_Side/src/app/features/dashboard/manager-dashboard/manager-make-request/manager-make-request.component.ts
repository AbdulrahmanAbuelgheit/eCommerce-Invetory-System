import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manager-make-request',
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './manager-make-request.component.html',
  styleUrls: ['./manager-make-request.component.scss'],
})
export class ManagerMakeRequestComponent implements OnInit {
  branchProducts: any[] = [];
  requestedProducts: any[] = [];
  displayedColumns: string[] = ['image', 'name', 'soldPrice','quantity', 'actions'];
  requestOrderColumns: string[] = ['name', 'requestedQty', 'delete'];
  dataSource: MatTableDataSource<any>;
  requestedProductsSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {
    this.dataSource = new MatTableDataSource(this.branchProducts);
    this.requestedProductsSource = new MatTableDataSource(
      this.requestedProducts
    );
  }

  ngOnInit(): void {
    this.fetchBranchProducts();
  }

  // Fetch branch products from the API
  fetchBranchProducts(): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: 'Bearer ' + token };
    this.http
      .get('http://localhost:7777/requests/branch/products', { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.branchProducts = response.branchProducts;
            this.dataSource = new MatTableDataSource(this.branchProducts);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        error: (err) => {
          console.error('Failed to fetch branch products:', err);
        },
      });
  }

  // Add a product to the request
  addToRequest(product: any): void {
    const existingProduct = this.requestedProducts.find(
      (p) => p.productId === product.productId
    );
    if (!existingProduct) {
      this.requestedProducts.push({ ...product, requestedQty: 1 });
      // Update the data source
      this.requestedProductsSource.data = [...this.requestedProducts];
    }
  }

  // Remove a product from the request
  removeFromRequest(product: any): void {
    this.requestedProducts = this.requestedProducts.filter(
      (p) => p.productId !== product.productId
    );
    this.requestedProductsSource.data = [...this.requestedProducts];
  }

  // Submit the request
  submitRequest(): void {
    const payload = {
      products: this.requestedProducts.map((product) => ({
        productId: product.productId,
        requestedQty: product.requestedQty,
      })),
    };
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: 'Bearer ' + token };

    this.http
      .post('http://localhost:7777/requests', payload, { headers })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Request submitted successfully!',
          });
          this.requestedProducts = []; // Clear the request list
        },
        error: (err) => {
          console.error('Failed to submit request:', err);
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
}
