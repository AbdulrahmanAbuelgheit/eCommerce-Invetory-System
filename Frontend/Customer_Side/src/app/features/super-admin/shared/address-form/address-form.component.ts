// features/admin/shared/address-form.component.ts
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '@app/services/admin.service';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule, /* other imports */],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="modal-header">
        <h4 class="modal-title">Add Address</h4>
        <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
      </div>

      <div class="modal-body">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Street</label>
            <input type="text" class="form-control" formControlName="street">
          </div>

          <div class="col-md-6">
            <label class="form-label">City</label>
            <input type="text" class="form-control" formControlName="city">
          </div>

          <div class="col-md-6">
  <label class="form-label">Governorate</label>
  <input type="text" class="form-control" formControlName="gov">
</div>

<div class="col-md-6">
  <label class="form-label">Zip Code</label>
  <input type="text" class="form-control" formControlName="zipCode">
</div>

          <div class="col-md-6">
            <label class="form-label">Country</label>
            <input type="text" class="form-control" formControlName="country">
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
          Save Address
        </button>
      </div>
    </form>
  `
})
export class AddressFormComponent {
  @Input() entityId!: string;
  @Input() entityType!: 'customer' | 'seller';
  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.form = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.adminService.addAddress(
      this.entityType,
      this.entityId,
      this.form.value
    ).subscribe({
      next: () => this.activeModal.close(),
      error: (error) => console.error('Failed to add address:', error)
    });
  }
}