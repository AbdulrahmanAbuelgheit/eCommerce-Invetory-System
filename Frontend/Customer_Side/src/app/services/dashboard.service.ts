import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

// Interface definitions
export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export interface DashboardData {
  orders: Order[];
  mostSoldProducts: MostSoldProduct[];
  yearlyData: { [year: string]: MonthData[] };
  totalProfit: number;
  totalOrders: number;
}

export interface Order {
  id: string;
  sellerId: string;
  products: OrderProduct[];
  totalPrice: number;
  totalQty: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productId: Product;
  productName: string;
  category: string;
  price: number;
  totalPrice: number;
  requiredQty: number;
}

export interface Product {
  _id: string;
  name: string;
  costPrice: number;
  soldPrice: number;
}

export interface MostSoldProduct {
  productId: string;
  productName: string;
  soldQty: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface MonthData {
  monthName: string;
  ordersCount: number;
  totalProfit: number;
  orders: MonthlyOrder[];
}

export interface MonthlyOrder {
  orderId: string;
  createdAt: string;
  totalPrice: number;
  totalQty: number;
  status: string;
  products: MonthlyOrderProduct[];
}

export interface MonthlyOrderProduct {
  productId: string;
  productName: string;
  price: number;
  requiredQty: number;
  totalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/sellers/admin/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardData(
    year: number,
    branchId?: string,
    sellerId?: string
  ): Observable<DashboardResponse> {
    let params = new HttpParams().set('year', year.toString());
    if (branchId) params = params.set('branchId', branchId);
    if (sellerId) params = params.set('sellerId', sellerId);

    return this.http.get<DashboardResponse>(this.baseUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    const errorMsg = error.error?.message || 'Failed to load dashboard data';
    return throwError(() => new Error(errorMsg));
  }
}