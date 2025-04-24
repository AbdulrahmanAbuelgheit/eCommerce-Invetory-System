// staff-login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StaffAuthService } from '@app/services/staff-auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule  
  ],
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.scss']
})
export class StaffLoginComponent {
  loginForm;
  isLoading = false;
  showPassword = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private fb: FormBuilder,
    private authService: StaffAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const credentials = {
        email: this.loginForm.value.email || '',
        password: this.loginForm.value.password || ''
      };

      this.authService.loginStaff(credentials).subscribe({
        next: (user) => {
          this.handleSuccessfulLogin(user);
        },
        error: (error) => {
          this.handleLoginError(error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.showFormErrors();
    }
  }

  private handleSuccessfulLogin(user: any): void {
    Swal.fire({
      title: 'Login Successful!',
      text: 'Redirecting to dashboard...',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: '#1a1a2e',
      color: '#fff'
    }).then(() => {
      this.router.navigateByUrl(this.getDashboardRoute(user.role,user.userType));
    });
  }

  private handleLoginError(error: any): void {
    this.isLoading = false;
    Swal.fire({
      title: 'Login Failed',
      html: `<p>${error.message}</p>`,
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

  private showFormErrors() {
    const errors: string[] = [];
    
    Object.entries(this.loginForm.controls).forEach(([field, control]) => {
      if (control.invalid && control.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          errors.push(this.getErrorMessage(field, errorKey));
        });
      }
    });

    if (errors.length > 0) {
      Swal.fire({
        title: 'Form Errors',
        html: `<ul class="error-list">${
          errors.map(msg => `<li>${msg}</li>`).join('')
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

  private getErrorMessage(field: string, errorKey: string): string {
    const fieldNames: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    
    const messages: { [key: string]: string } = {
      required: `${fieldNames[field]} is required`,
      email: 'Invalid email format',
      minlength: `${fieldNames[field]} must be at least 8 characters`
    };

    return messages[errorKey] || `Invalid ${fieldNames[field]}`;
  }

  private getDashboardRoute(role: string, userType:string): string {
    const routes: { [key: string]: string } = {
      super_admin: '/super-admin/dashboard',
      manager: '/manager-dashboard',
      seller: '/seller-dashboard',
      cashier: '/cashier'
    };
    if(userType=='seller')
    {
      return routes[userType];
    }
    return routes[role] || '/';
  }
}