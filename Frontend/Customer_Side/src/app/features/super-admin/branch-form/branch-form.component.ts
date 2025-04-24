import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Branch } from '@app/services/branch.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="modal-header bg-dark text-white">
      <h5 class="modal-title">{{ branch?._id ? 'Edit Branch' : 'Create New Branch' }}</h5>
      <button type="button" class="btn-close btn-close-white" (click)="activeModal.dismiss()"></button>
    </div>
    
    <div class="modal-body">
      <form (ngSubmit)="submitForm()">
        <div class="mb-3">
          <label class="form-label">Branch Name</label>
          <input type="text" class="form-control" [(ngModel)]="formData.name" name="name" required>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Location</label>
          <input type="text" class="form-control" [(ngModel)]="formData.location" name="location" required>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Phone Number</label>
          <input type="tel" class="form-control" [(ngModel)]="formData.phone" name="phone" required>
        </div>
        
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
          <button type="submit" class="btn btn-primary">
            {{ branch?._id ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class BranchFormComponent {
  @Input() branch?: Branch;
  formData: Partial<Branch> = { name: '', location: '', phone: '' };

  constructor(public activeModal: NgbActiveModal) {
    if (this.branch) {
      this.formData = { ...this.branch };
    }
  }

  submitForm() {
    if (!this.formData.name || !this.formData.location || !this.formData.phone) return;
    this.activeModal.close(this.formData);
  }
}