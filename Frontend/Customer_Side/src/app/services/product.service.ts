import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:7777/online/products';
  private filterUrl = 'http://localhost:7777/online/products/filter';
  private categoryUrl = 'http://localhost:7777/online/categories';
  private searchUrl = 'http://localhost:7777/online/products/search';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.categoryUrl}`);
  }

  getProducts(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/?page=${page}`);
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${productId}`);
  }

  getFilteredProducts(filters: any): Observable<any> {
    return this.http.get(this.filterUrl, { params: filters });
  }

  searchProducts(term: string): Observable<any> {
    return this.http.get(`${this.searchUrl}?term=${term}`);
  }
}