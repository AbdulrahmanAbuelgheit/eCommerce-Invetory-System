import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@app/environments/environment';
import { Observable } from 'rxjs';

export interface Category {
  _id: string; // Change 'id' to '_id'
  name: string;
  _v?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/online/categories`; // Correct endpoint

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(this.apiUrl);
  }

  createCategory(categoryData: { name: string }): Observable<any> {
    return this.http.post(`http://localhost:7777/categories`, categoryData);
  }

  updateCategory(_id: string, categoryData: { name: string }): Observable<any> {
    return this.http.put(`http://localhost:7777/categories/${_id}`, categoryData);
  }

  deleteCategory(_id: string): Observable<any> {
    return this.http.delete(`http://localhost:7777/categories/${_id}`);
  }
}