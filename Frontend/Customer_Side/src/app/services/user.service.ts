// src/app/services/user.service.ts
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly USER_DATA_KEY = 'userData';

  isLoggedIn = signal<boolean>(false);
  userData = signal<any>(null);

  constructor(
    private router: Router,
  ) {
    this.checkAuthState();
  }

  // Check if user is logged in on app initialization
  public checkAuthState(): void {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    //const userData = localStorage.getItem(this.USER_DATA_KEY);

    if (token) {
      this.isLoggedIn.set(true);
      //this.userData.set(JSON.parse(userData));
    }
  }

  // Login the user
  login(token: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    this.isLoggedIn.set(true);
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/']); // Redirect to home
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  // Check if user is a guest
  isGuest(): boolean {
    return !this.isLoggedIn();
  }

  // Get current user data
  getCurrentUser(): any {
    return this.userData();
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }
}