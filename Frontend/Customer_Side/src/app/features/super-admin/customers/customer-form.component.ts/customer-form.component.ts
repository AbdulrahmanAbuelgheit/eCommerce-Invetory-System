import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService, Customer } from '@app/services/admin.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customer!: Customer | null;
  form!: FormGroup;
  isSubmitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.customer) {
      this.form.patchValue({
        ...this.customer
      });
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone1: ['', [Validators.required]],
      addresses: this.fb.array([]) // Use FormArray for addresses
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const operation = this.customer?._id
      ? this.adminService.updateCustomer(this.customer._id, this.form.value)
      : this.adminService.createCustomer(this.form.value);

    operation.subscribe({
      next: () => {
        this.activeModal.close('success');
        Swal.fire('Success', `Customer ${this.customer ? 'updated' : 'created'}!`, 'success');
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