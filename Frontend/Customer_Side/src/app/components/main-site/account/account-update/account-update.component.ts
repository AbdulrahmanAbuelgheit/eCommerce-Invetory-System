import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomerService } from '../../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './account-update.component.html',
  styleUrl: './account-update.component.scss'
})
export class AccountUpdateComponent {

  @Input() userData: any;
  @Output() close = new EventEmitter<void>();

  imageFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor( private customerService: CustomerService) { };

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.imagePreview = URL.createObjectURL(this.imageFile);
    }
  }

  addAddress(): void {
    this.userData.addresses.push({ street: '', city: '', country: '' });
  }

  removeAddress(index: number): void {
    this.userData.addresses.splice(index, 1);
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const updatedData = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      phone1: this.userData.phone1,
      //addresses: this.userData.addresses
    };

    this.customerService.updateCustomer(this.userData._id, updatedData, this.imageFile || undefined).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.close.emit(); // Close modal on success
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to update profile';
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }



}
