// src/app/shared/validators/validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  return hasUpperCase && hasNumber ? null : { passwordPattern: true };
}

export function egyptianPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^(010|011|012|015)\d{8}$/.test(control.value);
  return valid ? null : { egyptianPhone: true };
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { passwordMismatch: true } 
      : null;
  };
}