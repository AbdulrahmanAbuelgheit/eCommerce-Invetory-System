import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AdminService, Cashier } from '@app/services/admin.service';
import Swal from 'sweetalert2';
import { Branch, BranchService } from '@app/services/branch.service';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-cashier-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cashier-form.component.html',
  styleUrls: ['./cashier-form.component.scss']
})
export class CashierFormComponent implements OnInit {
  cashier!: Cashier | null;
  form!: FormGroup;
  isSubmitting = false;
  branches: Branch[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private adminService: AdminService,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBranches();

    if (this.cashier) {
      const branchId = typeof this.cashier.branchId === 'object' 
                       ? this.cashier.branchId._id 
                       : this.cashier.branchId;

      this.form.patchValue({
        ...this.cashier,
        branchId: branchId || '',
        password: '' // Clear password for updates
      });

      this.form.get('password')?.disable();
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.cashier ? [] : [
        Validators.required, 
        Validators.minLength(9), 
        passwordPatternValidator
      ]],
      phone1: ['', [Validators.required, egyptianPhoneValidator]],
      SSN: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      branchId: ['', Validators.required],
      isActive: [true]
    });
  }

  private loadBranches(): void {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => this.branches = branches,
      error: (error) => Swal.fire('Error', 'Failed to load branches', 'error')
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const formValue = this.form.getRawValue();
    const operation = this.cashier?._id
      ? this.adminService.updateCashier(this.cashier._id, formValue)
      : this.adminService.createCashier(formValue);

    operation.subscribe({
      next: () => {
        this.activeModal.close('success');
        Swal.fire('Success', `Cashier ${this.cashier ? 'updated' : 'created'}!`, 'success');
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