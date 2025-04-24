import { Component } from '@angular/core';
import { IProduct } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { AlertService } from '../../../services/alert.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { ICartItem } from '@app/models/cart-item';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatInputModule, MatSelectModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  categories: any[] = [];
  products: IProduct[] = [];
  minPrice: number = 0;
  maxPrice: number = 100000;
  category: string = '';
  currentPage: number = 1;
  totalPages: number = 1; // Total number of pages
  searchTerm: string = ''; // Search term for the search functionality

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(
      (response: any) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  loadProducts(): void {
    this.productService.getProducts(this.currentPage).subscribe(
      (response: any) => {
        if (response.success) {
          this.products = response.data.products;
          this.totalPages = response.data.pagination.totalPages; // Update total pages
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  applyFilters(): void {
    const filters = {
      min: this.minPrice,
      max: this.maxPrice,
      categoryId: this.category,
      page: this.currentPage,
    };

    this.productService.getFilteredProducts(filters).subscribe(
      (response: any) => {
        if (response.success) {
          this.products = response.data.products;
          this.totalPages = response.data.pagination.totalPages; // Update total pages
        }
      },
      (error) => {
        console.error('Error fetching filtered products:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters(); // Fetch products for the new page
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe(
        (response: any) => {
          if (response.success) {
            this.products = response.data;
            this.totalPages = 1; // Reset pagination for search results
          }
        },
        (error) => {
          console.error('Error searching products:', error);
        }
      );
    } else {
      this.loadProducts(); // If search term is empty, reload all products
    }
  }

  async addToCart(product: IProduct): Promise<void> {
    const result = await this.alertService.confirmAddToCart(product.name);

    if (result.isConfirmed) {
      let cartItem: ICartItem = {
        _id: product._id,
        name: product.name,
        soldPrice: product.soldPrice,
        description: product.description,
        images: product.images,
        mainStock: product.mainStock,
        quantity: 1,
        categoryName: product.categoryName,
      };
      this.cartService.addToCart(cartItem);
    }
  }
}