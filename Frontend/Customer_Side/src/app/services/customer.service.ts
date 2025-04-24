import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:7777/customers';

  constructor(private http: HttpClient) { }

  //load customer account data
  getCustomerData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my/profile`);
  }


  //update account data
  updateCustomer(customerId: string, updatedData: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
  
    // Append updated data
    Object.keys(updatedData).forEach(key => {
      if (key === 'addresses') {
        formData.append(key, JSON.stringify(updatedData[key])); // Serialize array
      } else {
        formData.append(key, updatedData[key]);
      }
    });
  
    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put(`${this.baseUrl}/my/profile`, formData);
  }

  //Get Cutomer's Addresses
  getCustomerAddresses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my/addresses`);
  }

  //Add Customer's Address
  addCustomerAddress(address: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/my/addresses`, address);
  }

  //Delete Customer's Address
  deleteCustomerAddress(addressIndex: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/my/addresses/${addressIndex}`);
  }
}
