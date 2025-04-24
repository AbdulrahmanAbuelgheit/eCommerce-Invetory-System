import { Component } from '@angular/core';
import { ProductService, Product } from '@app/services/admin-product.service';
import { CategoryService } from '@app/services/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductFormComponent } from '@app/features/super-admin/product/product-form/product-form.component';
import Swal from 'sweetalert2';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbPaginationModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  products: Product[] = [];
  categories: any[] = [];
  currentPage = 1;
  totalItems = 0;
  isLoading = false;

  // Reactive Form
  filtersForm: FormGroup;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.filtersForm = this.fb.group({
      searchQuery: [''],
      min: [''],
      max: [''],
      category: ['']
    });

    this.loadProducts();
    this.loadCategories();
  }

  // Load products with pagination and filters
  loadProducts() {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      search: this.filtersForm.value.searchQuery,
      ...this.filtersForm.value
    };

    this.productService.getProducts(params.page, params.search, params)
      .subscribe({
        next: (res) => {
          this.products = res.data as Product[]; // Cast to Product[]
          this.totalItems = res.total || 0; // Ensure total is set correctly
          this.isLoading = false;
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to load products', 'error');
          this.isLoading = false;
        }
      });
  }

  // Load categories for the filter dropdown
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => this.categories = res.data,
      error: (err) => Swal.fire('Error', 'Failed to load categories', 'error')
    });
  }

  // Handle page change event
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  // Handle search input event
  onSearchInput() {
    this.currentPage = 1;
    this.loadProducts();
  }

  // Open the product form modal
  openProductForm(product?: Product) {
    const modalRef = this.modalService.open(ProductFormComponent, { size: 'xl' });
    modalRef.componentInstance.product = product;
    modalRef.componentInstance.categories = this.categories;

    modalRef.result.then(() => {
      this.loadProducts();
      Swal.fire('Success', 'Product saved!', 'success');
    }).catch(() => {});
  }

  // Apply filters and reload products
  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  // Reset filters and reload products
  resetFilters() {
    this.filtersForm.reset();
    this.applyFilters();
  }

  // Delete a product
  deleteProduct(_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(_id).subscribe({
          next: () => {
            this.loadProducts();
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
          },
          error: (err) => Swal.fire('Error', 'Failed to delete product', 'error')
        });
      }
    });
  }
}