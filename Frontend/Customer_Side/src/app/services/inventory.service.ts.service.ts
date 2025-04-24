// core/services/inventory.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environments/environment';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  lastRestock: Date;
  minimumStock: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  createItem(itemData: Omit<InventoryItem, 'id'>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, itemData);
  }

  deleteItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${itemId}`);
  }
}