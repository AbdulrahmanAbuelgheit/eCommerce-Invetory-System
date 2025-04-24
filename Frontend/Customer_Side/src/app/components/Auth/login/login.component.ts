import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service.service';
import { LoginResponse } from '../../../interfaces/login-response.interface';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { CartService } from '@app/services/cart.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.isSubmitting = true;

      this.authService.login(email, password).subscribe({
        next: (response: LoginResponse) => {
          if (response?.token) {
            localStorage.setItem('authToken', response.token);
            // Raise the isLoggedIn signal and fetch the user cart
            this.userService.login(response.token);
            // Initialize the cart on login
            this.cartService.initializeCart();
            this.showSuccessAlert('Login Successful', 'Redirecting to dashboard...');
            this.router.navigate(['/']);
          } else {
            this.showErrorAlert('Login Failed', ['Invalid response from server']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.handleError(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.showFormErrors();
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessages: string[] = [];

    if (error.status === 400 || error.status === 401) {
      const apiError = error.error;
      if (apiError?.errors) {
        errorMessages = this.formatValidationErrors(apiError.errors);
      } else {
        errorMessages.push(apiError?.message || 'Invalid email or password');
      }
    } else {
      errorMessages.push('An unexpected error occurred. Please try again.');
    }

    this.showErrorAlert('Login Failed', errorMessages);
  }

  private formatValidationErrors(errors: { [key: string]: string[] }): string[] {
    return Object.entries(errors).flatMap(([field, messages]) => 
      messages.map(message => `${this.humanizeField(field)}: ${message}`)
    );
  }

  private humanizeField(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'email': 'Email',
      'password': 'Password'
    };
    return fieldMap[field] || field.replace(/([A-Z])/g, ' $1').trim();
  }

  private showFormErrors() {
    const errors: string[] = [];
    
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control?.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          if (errorKey !== 'serverError') {
            errors.push(this.getErrorMessage(key, errorKey));
          }
        });
      }
    });

    this.showErrorAlert('Form Errors', errors);
  }

  private getErrorMessage(field: string, errorKey: string): string {
    const fieldName = this.humanizeField(field);
    
    const messages: { [key: string]: string } = {
      'required': `${fieldName} is required`,
      'email': 'Invalid email format',
      'minlength': `${fieldName} must be at least 6 characters`
    };

    return messages[errorKey] || `Invalid ${fieldName}`;
  }

  private showSuccessAlert(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#3f51b5',
      timer: 2000,
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-button'
      }
    });
  }

  private showErrorAlert(title: string, messages: string[]) {
    Swal.fire({
      title,
      html: `<ul class="error-list">${
        messages.map(msg => `<li>${msg}</li>`).join('')
      }</ul>`,
      icon: 'error',
      confirmButtonColor: '#3f51b5',
      background: '#1a1a2e',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-button'
      }
    });
  }
}