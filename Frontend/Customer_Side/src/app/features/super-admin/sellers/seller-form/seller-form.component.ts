import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService, Seller } from '@app/services/admin.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.scss']
})
export class SellerFormComponent implements OnInit {
  seller!: Seller | null;
  form!: FormGroup;
  isSubmitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.seller) {
      this.form.patchValue({
        ...this.seller,
        password: '' // Clear password for updates
      });
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.seller ? [] : [
        Validators.required, 
        Validators.minLength(9)
      ]],
      phone1: ['', [Validators.required]],
      SSN: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      companyName: ['', Validators.required],
      companyRegistrationNumber: ['', [Validators.required, Validators.minLength(5)]],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const operation = this.seller?._id
      ? this.adminService.updateSeller(this.seller._id, this.form.value)
      : this.adminService.createSeller(this.form.value);

    operation.subscribe({
      next: () => {
        this.activeModal.close('success');
        Swal.fire('Success', `Seller ${this.seller ? 'updated' : 'created'}!`, 'success');
      },
      error: (error) => {
        Swal.fire('Error', error.error?.message || 'Operation failed', 'error');
        this.isSubmitting = false;
      }
    });
  }

  get f() {
    return this.form.controls;
  }
}