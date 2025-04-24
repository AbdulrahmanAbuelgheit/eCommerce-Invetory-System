// seller-signup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, FormGroup, ValidationErrors,ValidatorFn } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '@app/services/auth-service.service';
import { ApiResponse } from '@app/interfaces/api-response.interface';
import { ApiErrorResponse } from '@app/interfaces/api-error-response.interface';

// Reuse validators from customer signup
function passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  return hasUpperCase && hasNumber ? null : { passwordPattern: true };
}

function egyptianPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^(010|011|012|015)\d{8}$/.test(control.value);
  return valid ? null : { egyptianPhone: true };
}

// Password match validator
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-seller-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './seller-signup.component.html',
  styleUrls: ['./seller-signup.component.scss'] // Reuse the same styles
})
export class SellerSignupComponent {
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      companyName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      companyRegistrationNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(10),
        Validators.maxLength(20)
      ]],
      SSN: ['', [
        Validators.required,
        Validators.pattern(/^\d{14}$/)
      ]],
      
      // Common fields
  firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      phone1: ['', [
        Validators.required,
        egyptianPhoneValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(128),
        passwordPatternValidator
      ]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: passwordMatchValidator()
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  markAllAsTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  onSubmit() {
    this.markAllAsTouched();
    if (this.registerForm.valid) {
      this.isLoading = true;

      // Add seller-specific data to payload
      const payload = {
        ...this.registerForm.value,
        userType: 'seller' // Ensure backend only accepts sellers here
      };

      this.authService.registerSeller(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessAlert('Seller Registration Successful', 'You will be redirected to login');
          this.registerForm.reset();
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    } else {
      this.showFormErrors();
    }
  }
  
  private handleError(error: HttpErrorResponse) {
    this.isLoading = false;
    console.error('Registration error:', error);
  
    let errorMessages: string[] = [];
  
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessages.push('Network error occurred. Please check your connection.');
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
        case 422:
          const apiError = error.error as ApiErrorResponse;
          errorMessages = apiError?.errors ? 
            this.formatValidationErrors(apiError.errors) : 
            [apiError?.message || 'Invalid form submission'];
          break;
        case 409:
          // Handle duplicate email or phone number
          errorMessages.push('This email or phone number is already registered.');
          break;
        case 500:
          // Handle 500 errors (e.g., duplicate key errors)
          if (error.error.message?.includes('dup key')) {
            if (error.error.message.includes('email_1')) {
              errorMessages.push('This email is already registered.');
            } else if (error.error.message.includes('phone1_1')) {
              errorMessages.push('This phone number is already registered.');
            } else {
              errorMessages.push('A duplicate record already exists.');
            }
          } else {
            errorMessages.push('An unexpected server error occurred. Please try again later.');
          }
          break;
        default:
          errorMessages.push('An unexpected error occurred. Please try again later.');
      }
    }
  
    this.showErrorAlert('Registration Failed', errorMessages);
  }

  private formatValidationErrors(errors: { [key: string]: string[] }): string[] {
    return Object.entries(errors).flatMap(([field, messages]) => 
      messages.map(message => `${this.humanizeField(field)}: ${message}`)
    );
  }

  private humanizeField(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'companyName': 'Company Name',
      'companyRegistrationNumber': 'Company Registration Number',
      'SSN': 'SSN',
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'phone1': 'Phone Number',
      'confirmPassword': 'Confirm Password'
    };
    return fieldMap[field] || field.replace(/_/g, ' ');
  }

  private showFormErrors() {
    const errors: string[] = [];
    
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control?.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          if (errorKey !== 'serverError') {
            errors.push(this.getErrorMessage(key, errorKey));
          }
        });
      }
    });

    if (this.registerForm.errors?.['passwordMismatch']) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      this.showErrorAlert('Form Errors', errors);
    }  }

  private getErrorMessage(field: string, errorKey: string): string {
    const fieldName = this.humanizeField(field);
    
    const messages: { [key: string]: string } = {
      'required': `${fieldName} is required`,
      'minlength': `${fieldName} is too short`,
      'maxlength': `${fieldName} is too long`,
      'email': 'Invalid email format',
      'pattern': `Invalid ${fieldName} format`,
      'passwordPattern': 'Password must contain at least one uppercase letter and one number',
      'egyptianPhone': 'Invalid Egyptian phone number format'
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