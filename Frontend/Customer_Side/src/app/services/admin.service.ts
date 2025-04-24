import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@app/environments/environment';
import { Observable } from 'rxjs';
import { Branch } from './branch.service';

// Common Interfaces
interface Address {
  street: string;
  city: string;
  gov: string;
  zipCode: string;
  _id?: string;
}

interface Image {
  fileId: string;
  filePath: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  total?: number;
}

// Base User Interface
interface BaseUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone1: string;
  image: Image;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userType: 'seller' | 'customer' | 'staff';
  addresses?: Address[];
}

// Seller Interface
export interface Seller extends BaseUser {
  companyName: string;
  companyRegistrationNumber: string;
  SSN: string;
  userType: 'seller';
}

// Customer Interface
export interface Customer extends BaseUser {
  userType: 'customer';
  addresses: Address[];
}

// Staff Interface (Manager/Cashier)
interface Staff extends BaseUser {
  SSN: string;
  branchId: string | {
    _id: string;
    name: string;
    location: string;
    phone: string;
  };
  role: 'manager' | 'cashier';
  userType: 'staff';
}

export interface Manager extends Staff {
  role: 'manager';
}

export interface Cashier extends Staff {
  role: 'cashier';
}

// Paginated Responses
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

// Specific Paginated Types
type PaginatedSellers = PaginatedResponse<Seller>;
type PaginatedCustomers = PaginatedResponse<Customer>;
type PaginatedManagers = PaginatedResponse<Manager>;
type PaginatedCashiers = PaginatedResponse<Cashier>;

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ========================
  // Generic Pagination Handler
  // ========================
  private getPaginated<T>(
    endpoint: string,
    page?: number,
    limit?: number,
    search?: string
  ): Observable<PaginatedResponse<T>> {
    let params = new HttpParams();

    if (page && limit) {
      params = params
        .set('page', page.toString())
        .set('limit', limit.toString());

      if (search) {
        params = params.set('search', search);
      }
    }

    return this.http.get<PaginatedResponse<T>>(`${this.apiUrl}/${endpoint}`, { params });
  }

  // ========================
  // Seller Operations
  // ========================
  getSellers(page?: number, limit?: number, search?: string): Observable<PaginatedSellers> {
    return this.getPaginated<Seller>('sellers', page, limit, search);
  }

  getSellerById(id: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.apiUrl}/sellers/${id}`);
  }

  createSeller(data: Omit<Seller, '_id' | 'createdAt' | 'updatedAt'>): Observable<Seller> {
    return this.http.post<Seller>(`${this.apiUrl}/sellers`, data);
  }

  updateSeller(id: string, data: Partial<Seller>): Observable<Seller> {
    return this.http.put<Seller>(`${this.apiUrl}/sellers/${id}`, data);
  }

  deleteSeller(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sellers/${id}`);
  }

  // Seller Addresses
  getSellerAddressesById(id: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/sellers/${id}/addresses`);
  }

  addAddressToSellerById(id: string, address: Address): Observable<Seller> {
    return this.http.post<Seller>(`${this.apiUrl}/sellers/${id}/addresses`, address);
  }

  // ========================
  // Customer Operations
  // ========================
  getCustomers(page?: number, limit?: number, search?: string): Observable<PaginatedCustomers> {
    return this.getPaginated<Customer>('customers', page, limit, search);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`);
  }

  createCustomer(data: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, data);
  }

  updateCustomer(id: string, data: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${id}`, data);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/customers/${id}`);
  }

  // Customer Addresses
  getCustomerAddressesById(id: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/customers/${id}/addresses`);
  }

  addAddressToCusById(id: string, address: Address): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers/${id}/addresses`, address);
  }

  // ========================
  // Manager Operations
  // ========================
  getManagers(page?: number, limit?: number, search?: string): Observable<PaginatedManagers> {
    return this.getPaginated<Manager>('managers', page, limit, search);
  }

  getManagerById(id: string): Observable<Manager> {
    return this.http.get<Manager>(`${this.apiUrl}/managers/${id}`);
  }

  createManager(data: Omit<Manager, '_id' | 'createdAt' | 'updatedAt'>): Observable<Manager> {
    const processedData = this.processStaffData(data);
    return this.http.post<Manager>(`${this.apiUrl}/managers`, processedData);
  }

  updateManager(id: string, data: Partial<Manager>): Observable<Manager> {
    const processedData = this.processStaffData(data);
    return this.http.put<Manager>(`${this.apiUrl}/managers/${id}`, processedData);
  }

  deleteManager(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/managers/${id}`);
  }

  // ========================
  // Cashier Operations
  // ========================
  getCashiers(page?: number, limit?: number, search?: string): Observable<PaginatedCashiers> {
    return this.getPaginated<Cashier>('cashiers', page, limit, search);
  }

  getCashierById(id: string): Observable<Cashier> {
    return this.http.get<Cashier>(`${this.apiUrl}/cashiers/${id}`);
  }

  createCashier(data: Omit<Cashier, '_id' | 'createdAt' | 'updatedAt'>): Observable<Cashier> {
    const processedData = this.processStaffData(data);
    return this.http.post<Cashier>(`${this.apiUrl}/cashiers`, processedData);
  }

  updateCashier(id: string, data: Partial<Cashier>): Observable<Cashier> {
    const processedData = this.processStaffData(data);
    return this.http.put<Cashier>(`${this.apiUrl}/cashiers/${id}`, processedData);
  }

  deleteCashier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cashiers/${id}`);
  }

  // ========================
  // Common Staff Data Processing
  // ========================
  private processStaffData<T extends Partial<Staff>>(data: T): T {
    return {
      ...data,
      branchId: typeof data.branchId === 'object' ? data.branchId._id : data.branchId
    };
  }

  // ========================
  // Branch Operations
  // ========================
  getBranch(branchId: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/branches/${branchId}`);
  }
}