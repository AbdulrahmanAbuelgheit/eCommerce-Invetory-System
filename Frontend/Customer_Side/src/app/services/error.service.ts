import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  showSuccessAlert(title: string, text: string): void {
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

  showErrorAlert(title: string, messages: string[]): void {
    Swal.fire({
      title,
      html: `<ul class="error-list">${messages.map(msg => `<li>${msg}</li>`).join('')}</ul>`,
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

  humanizeField(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'phone1': 'Phone Number',
      'confirmPassword': 'Confirm Password'
    };
    return fieldMap[field] || field.replace(/([A-Z])/g, ' $1').trim();
  }
}