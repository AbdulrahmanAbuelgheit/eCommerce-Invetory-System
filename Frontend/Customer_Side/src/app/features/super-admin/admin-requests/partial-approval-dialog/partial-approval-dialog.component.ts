import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-partial-approval-dialog',
  imports:[MatInputModule,CommonModule,MatFormFieldModule,MatDialogModule,FormsModule,ReactiveFormsModule],
  templateUrl: './partial-approval-dialog.component.html',
  styleUrls: ['./partial-approval-dialog.component.scss'],
})
export class PartialApprovalDialogComponent {
  partialApprovalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PartialApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.partialApprovalForm = this.fb.group({});
    this.data.products.forEach((product: any, index: number) => {
      this.partialApprovalForm.addControl(
        'approvedQty' + index,
        this.fb.control(0, [Validators.min(0), Validators.max(product.productId.mainStock)])
      );
    });
  }

  // Submit partial approval
  submitPartialApproval(): void {
    const approvedProducts = this.data.products.map((product: any, index: number) => ({
      productId: product.productId._id,
      approvedQty: this.partialApprovalForm.get('approvedQty' + index)?.value,
    }));

    const payload = {
      adminResponse: 'Partial approval completed',
      approvedProducts,
    };

    this.dialogRef.close(payload);
  }
}