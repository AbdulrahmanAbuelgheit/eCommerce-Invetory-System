// features/inventory/form/inventory-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '@app/services/inventory.service.ts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-form.component.html'
})
export class InventoryFormComponent {
  form;
  submitting = false;
  error: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      minimumStock: [5, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.error = null;
    
    const itemData = {
      ...this.form.getRawValue(),
      lastRestock: new Date()
    };
    
    this.inventoryService.createItem(itemData).subscribe({
      next: () => {
        this.activeModal.close('success');
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to create inventory item';
        this.submitting = false;
      }
    });
  }
}