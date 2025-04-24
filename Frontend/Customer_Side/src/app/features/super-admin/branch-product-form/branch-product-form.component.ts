import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '@app/services/admin-product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-branch-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-product-form.component.html'
})
export class BranchProductFormComponent {
  @Input() products: Product[] = [];
  @Input() existingProductIds: string[] = [];
  @Input() stockItem: any;

  selectedProduct: string = '';
  quantity: number = 1;
  isEditMode = false;

  constructor(public activeModal: NgbActiveModal) {
    if (this.stockItem) {
      this.isEditMode = true;
      this.selectedProduct = this.stockItem.product._id;
      this.quantity = this.stockItem.quantity;
    }
  }

  get availableProducts() {
    return this.products.filter(p => 
      !this.existingProductIds.includes(p._id) || this.isEditMode
    );
  }

  get maxQuantity() {
    const product = this.products.find(p => p._id === this.selectedProduct);
    return product ? product.mainStock + (this.isEditMode ? this.stockItem.quantity : 0) : 0;
  }

  submit() {
    if (!this.selectedProduct || this.quantity <= 0 || this.quantity > this.maxQuantity) {
      return;
    }
    this.activeModal.close({
      productId: this.selectedProduct,
      quantity: this.quantity
    });
  }
}