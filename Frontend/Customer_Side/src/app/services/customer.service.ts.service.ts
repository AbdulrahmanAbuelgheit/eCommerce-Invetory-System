// core/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/environments/environment';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  createCustomer(customerData: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customerData);
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerId}`);
  }
}