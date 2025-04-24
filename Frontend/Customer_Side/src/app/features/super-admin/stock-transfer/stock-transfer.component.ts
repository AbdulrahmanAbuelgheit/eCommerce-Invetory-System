import { Component, OnInit } from '@angular/core';
import { Branch, BranchService } from '@app/services/branch.service';
import { ProductService, Product } from '@app/services/admin-product.service';
import { AdminService } from '@app/services/admin.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-transfer',
  imports: [FormsModule,CommonModule],
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit {
  // Data Sources
  branches: Branch[] = [];
  products: Product[] = [];
  
  // Form Selections
  selectedBranchId: string = '';
  selectedProductId: string = '';
  transferQuantity: number = 1;
  
  // State Management
  isLoading: boolean = false;
  selectedProductStock: number = 0;

  constructor(
    private branchService: BranchService,
    private productService: ProductService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    
    // Load branches from AdminService
    this.branchService.getAllBranches().subscribe({
      next: (branches) => this.branches = branches,
      error: (err) => this.showError('Failed to load branches')
    });

    // Load products from ProductService
    this.productService.getProducts(1, '', {}).subscribe({ // Remove pagination
      next: (res) => {
        this.products = Array.isArray(res.data) ? res.data : [res.data];
        this.isLoading = false;
      },
      error: (err) => this.showError('Failed to load products')
    });
  }

  onProductSelect(): void {
    const product = this.products.find(p => p._id === this.selectedProductId);
    this.selectedProductStock = product?.mainStock || 0;
  }

  transferStock(): void {
    if (!this.validateForm()) return;

    const payload = {
      productId: this.selectedProductId,
      quantity: this.transferQuantity
    };

    this.isLoading = true;
    
    // 1. Add to branch stock
    this.branchService.addProductToBranch(this.selectedBranchId, payload)
      .subscribe({
        next: () => {
          // 2. Update main stock
          this.updateMainStock();
          this.showSuccess();
          this.resetForm();
        },
        error: (err) => this.showError(err.error?.message || 'Transfer failed')
      });
  }

  private updateMainStock(): void {
    const product = this.products.find(p => p._id === this.selectedProductId);
    if (product) {
      product.mainStock -= this.transferQuantity;
    }
  }

  private validateForm(): boolean {
    if (!this.selectedBranchId || !this.selectedProductId) {
      this.showError('Please select both branch and product');
      return false;
    }

    if (this.transferQuantity <= 0 || this.transferQuantity > this.selectedProductStock) {
      this.showError(`Invalid quantity. Available stock: ${this.selectedProductStock}`);
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.selectedBranchId = '';
    this.selectedProductId = '';
    this.transferQuantity = 1;
    this.selectedProductStock = 0;
    this.isLoading = false;
  }

  private showSuccess(): void {
    Swal.fire({
      icon: 'success',
      title: 'Transfer Successful!',
      text: 'Stock has been updated in both locations',
      timer: 2000
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Operation Failed',
      text: message,
      timer: 3000
    });
  }
}