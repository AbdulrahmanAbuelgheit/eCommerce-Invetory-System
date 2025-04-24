import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@app/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Define the structure of a product image
interface ProductImage {
  fileId: string;
  filePath: string;
  _id?: string;
}

// Define the structure of a product
export interface Product {
  _id: string;
  name: string;
  costPrice: number;
  soldPrice: number;
  description: string;
  mainStock: number;
  categoryId: string;
  categoryName: string;
  sellerId?: string;
  createdAt?: string;
  updatedAt?: string;
  images: ProductImage[];
  _v?: number;

  // Add an index signature to allow dynamic string keys
  [key: string]: any;
}

// Define the structure of the API response for product operations
interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product | Product[];
  total?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, search: string = '', filters?: any): Observable<ProductResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (filters) {
      if (filters.min) {
        params = params.set('min', filters.min);
      }
      if (filters.max) {
        params = params.set('max', filters.max);
      }
      if (filters.category) {
        params = params.set('category', filters.category);
      }
    }

    return this.http.get<ProductResponse>(`${this.apiUrl}/filter`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products. Please try again.'));
      })
    );
  }

  createProduct(product: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, product).pipe(
      catchError((error) => {
        console.error('Error creating product:', error);
        return throwError(() => new Error('Failed to create product. Please try again.'));
      })
    );
  }

  updateProduct(id: string, product: FormData): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product).pipe(
      catchError((error) => {
        console.error('Error updating product:', error);
        return throwError(() => new Error('Failed to update product. Please try again.'));
      })
    );
  }

  deleteProduct(id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Failed to delete product. Please try again.'));
      })
    );
  }
}