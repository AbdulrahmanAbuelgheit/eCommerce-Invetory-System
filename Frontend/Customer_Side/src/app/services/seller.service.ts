// seller.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface DashboardResponse {
  success: boolean;
  data: {
    sellerProducts: any[];
    sellerOrders: any[];
    mostSoldProducts: any[];
    totalProfit: number;
    yearlyData: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'http://localhost:7777/sellers/dashboard';

  constructor(private http: HttpClient) {}

  
  getAccountData(){
    return this.http.get<{ success: boolean; data: any[] }>('http://localhost:7777/sellers/my/profile');
  }

  getDashboardData() {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }

  getProducts() {
    return this.http.get<{ success: boolean; data: any[] }>('http://localhost:7777/sellers/my/products-with-branches');
  }

}