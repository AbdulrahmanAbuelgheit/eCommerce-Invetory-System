import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AdminService, Manager } from '@app/services/admin.service';
import { BranchService } from '@app/services/branch.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

function passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null; // Allow empty for updates
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  return hasUpperCase && hasNumber ? null : { passwordPattern: true };
}

function egyptianPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^(010|011|012|015)\d{8}$/.test(control.value);
  return valid ? null : { egyptianPhone: true };
}

@Component({
  selector: 'app-manager-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss']
})
export class ManagerFormComponent implements OnInit {
  manager!: Manager | null;
  form!: FormGroup;
  isSubmitting = false;
  branches: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private adminService: AdminService,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBranches();

    if (this.manager) {
      const branchId = typeof this.manager.branchId === 'object' 
                       ? this.manager.branchId._id 
                       : this.manager.branchId;

      this.form.patchValue({
        ...this.manager,
        branchId: branchId || '',
        password: ''
      });
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        this.manager 
          ? [Validators.minLength(9), passwordPatternValidator]
          : [Validators.required, Validators.minLength(9), passwordPatternValidator]
      ],
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
    const formData = { ...this.form.value };

    // Remove password if empty during update
    if (this.manager?._id && formData.password === '') {
      delete formData.password;
    }

    const operation = this.manager?._id
      ? this.adminService.updateManager(this.manager._id, formData)
      : this.adminService.createManager(formData);
      console.log("formData :", formData);

    operation.subscribe({
      next: () => {
        this.activeModal.close('success');
        Swal.fire('Success', `Manager ${this.manager ? 'updated' : 'created'}!`, 'success');
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