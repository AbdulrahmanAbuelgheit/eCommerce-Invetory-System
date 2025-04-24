// features/staff/form/staff-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffService } from '@app/services/staff.service.ts.service';
import { CommonModule } from '@angular/common';
import { StaffAuthService } from '@app/services/staff-auth.service';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './staff-form.component.html',
})
export class StaffFormComponent {
  form;
  submitting = false;
  error: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private staffService: StaffService,
    private auth: StaffAuthService
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['cashier' as 'cashier' | 'manager', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      branchId: [this.auth.getCurrentBranch() || '', Validators.required] // Ensure branchId is not null
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.error = null;
    
    const staffData = {
      ...this.form.getRawValue(),
      status: 'active', // Default status
      lastLogin: new Date() // Set last login time
    };

    // this.staffService.createStaff().subscribe({
    //   next: () => {
    //     this.activeModal.close('success');
    //     this.submitting = false;
    //   },
    //   error: (err) => {
    //     this.error = err.message || 'Failed to create staff';
    //     this.submitting = false;
    //   }
    // });
  }
}