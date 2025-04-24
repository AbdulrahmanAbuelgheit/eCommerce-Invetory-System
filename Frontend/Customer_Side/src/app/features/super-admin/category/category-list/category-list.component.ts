import { Component } from '@angular/core';
import { CategoryService, Category } from '@app/services/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryFormComponent } from '@app/features/super-admin/category/category-form/category-form.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  categories: Category[] = [];
  isLoading = false;

  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to load categories', 'error');
        this.isLoading = false;
      }
    });
  }

  openCategoryForm(category?: Category) {
    const modalRef = this.modalService.open(CategoryFormComponent, { centered: true });
    modalRef.componentInstance.category = category; // Pass the category object
    
    modalRef.result.then(() => {
      this.loadCategories(); // Refresh the list after the modal closes
    }).catch(() => {});
  }

  deleteCategory(_id: string) { // Change 'id' to '_id'
    Swal.fire({
      title: 'Delete Category?',
      text: 'All related products will be affected!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(_id).subscribe({ // Change 'id' to '_id'
          next: () => {
            this.loadCategories();
            Swal.fire('Deleted!', 'Category deleted successfully.', 'success');
          },
          error: (err) => Swal.fire('Error', 'Delete failed', 'error')
        });
      }
    });
  }
}