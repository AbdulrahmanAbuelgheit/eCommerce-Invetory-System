import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



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


type PaginatedCashiers = PaginatedResponse<Cashier>;

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  

  private apiUrl = 'http://localhost:7777/managers';
  
    constructor(private http: HttpClient) {}
  
  
    getProducts() {
      return this.http.get<{ success: boolean; data: any[] }>('http://localhost:7777/branches/my/BranchProducts');
    }

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
//http://localhost:7777/cashiers/my-branch-cashiers

    // ========================
      // Cashier Operations
      // ========================
      getCashiers(page?: number, limit?: number, search?: string): Observable<PaginatedCashiers> {
        return this.getPaginated<Cashier>('cashiers/my-branch-cashiers', page, limit, search);
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

      private processStaffData<T extends Partial<Staff>>(data: T): T {
        return {
          ...data,
          branchId: typeof data.branchId === 'object' ? data.branchId._id : data.branchId
        };
      }

}
