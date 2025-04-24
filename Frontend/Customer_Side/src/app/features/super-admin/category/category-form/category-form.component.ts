import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService, Category } from '@app/services/category.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, CommonModule, ReactiveFormsModule], // Add ReactiveFormsModule and CommonModule
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  category: Category | undefined; // Use the Category interface
  form: FormGroup;
  isSubmitting = false;
  isEditMode = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    console.log('Category passed to form:', this.category); // Debugging
    if (this.category) {
      this.isEditMode = true;
      this.form.patchValue(this.category);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;
    const categoryData = { name: this.form.value.name };
  
    if (this.isEditMode && this.category) {
      console.log('Updating category with ID:', this.category._id); // Debugging
      this.categoryService.updateCategory(this.category._id, categoryData).subscribe({
        next: () => {
          this.activeModal.close('success');
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Category updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error updating category:', error); // Debugging
          Swal.fire('Error', error.error?.message || 'Failed to update category', 'error');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new category
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.activeModal.close('success');
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'Category created successfully',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          Swal.fire('Error', error.error?.message || 'Failed to create category', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }
  get f() {
    return this.form.controls;
  }
}