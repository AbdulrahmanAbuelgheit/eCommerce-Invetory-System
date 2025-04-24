import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Product, ProductService } from '@app/services/admin-product.service';
import Swal from 'sweetalert2';
import { AdminService } from '@app/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbPaginationModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  @Input() product: Product | null = null; // Input for editing an existing product
  @Input() categories: any[] = []; // Input for category dropdown
  @Output() productSaved = new EventEmitter<void>(); // Output to notify parent component

  productForm: FormGroup;
  selectedImages: File[] = [];
  sellers: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private productService: ProductService,
    private adminService: AdminService
  ) {
    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      costPrice: ['', [Validators.required, Validators.min(0)]],
      soldPrice: ['', [Validators.required, Validators.min(0)]],
      mainStock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      sellerId: ['', Validators.required]
    });

    // Fetch sellers
    this.loadSellers();
  }

  ngOnInit(): void {
    if (this.product) {
      // Populate form with existing product data for editing
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        costPrice: this.product.costPrice,
        soldPrice: this.product.soldPrice,
        mainStock: this.product.mainStock,
        categoryId: this.product.categoryId,
        sellerId: this.product.sellerId
      });
    }
  }

  // Load sellers
  loadSellers() {
    this.adminService.getSellers().subscribe({
      next: (res) => this.sellers = res.data,
      error: (err) => Swal.fire('Error', 'Failed to load sellers', 'error')
    });
  }

  // Handle file input change
  onFileChange(event: any) {
    const files = event.target.files;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    this.selectedImages = Array.from(files as FileList).filter((file: File) => {
      if (!validTypes.includes(file.type)) {
        Swal.fire('Error', 'Invalid file type. Only JPEG, PNG, and GIF are allowed.', 'error');
        return false;
      }
      if (file.size > maxSize) {
        Swal.fire('Error', 'File size exceeds 5MB.', 'error');
        return false;
      }
      return true;
    });
  }

  // Submit the form
  onSubmit() {
    if (this.productForm.invalid) {
      Swal.fire('Error', 'Please fill out all required fields correctly.', 'error');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    // Append product details to FormData
    Object.keys(this.productForm.controls).forEach(key => {
      const value = this.productForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Append images to FormData
    if (this.selectedImages.length > 0) {
      this.selectedImages.forEach((file, index) => {
        formData.append('images', file, file.name); // 'images' is the key expected by the API
      });
    }

    if (this.product) {
      // Update existing product
      this.productService.updateProduct(this.product._id, formData).subscribe({
        next: (res) => {
          this.activeModal.close();
          this.productSaved.emit();
          Swal.fire('Success', 'Product updated successfully!', 'success');
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to update product', 'error');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new product
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          this.activeModal.close();
          this.productSaved.emit();
          Swal.fire('Success', 'Product created successfully!', 'success');
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to create product', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }
}