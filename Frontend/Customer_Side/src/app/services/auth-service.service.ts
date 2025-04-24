// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/register-request.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { UserService } from '@app/user.service';



@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, userService:UserService) { }

  register(userData: RegisterRequest): Observable<ApiResponse> {
    const cart = this.getTransformedCart();
    userData.cart = cart;
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/auth/register`,
      userData
    );
  }
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      { email, password }
    );
  }

  registerSeller(sellerData: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/auth/register`,
      sellerData
    );
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
    alert(localStorage.getItem('authToken'));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }
  getToken(): string | null {
    console.log(localStorage.getItem('authToken'));
    return localStorage.getItem('authToken');
  }


  //get cart if found in local storage
  getTransformedCart() {
    // Retrieve the JSON string from localStorage
    const cartData = localStorage.getItem('cart');
  
    // Check if cartData exists
    if (!cartData) {
      console.log('No cart data found in localStorage.');
      return null;
    }
  
    try {
      // Parse the JSON string into an array of objects
      const cartArray = JSON.parse(cartData);
  
      // Ensure the parsed data is an array
      if (!Array.isArray(cartArray)) {
        console.error('Cart data is not an array.');
        return null;
      }
  
      // Transform the array by renaming _id to productId
      const transformedCartArray = cartArray.map(({ _id, ...rest }) => ({
        productId: _id,
        ...rest
      }));
  
      // Wrap the transformed array in an object with the key 'products'
      return {
        products: transformedCartArray
      };
    } catch (error) {
      console.error('Error parsing cart data:', error);
      return null;
    }
  }
  
}