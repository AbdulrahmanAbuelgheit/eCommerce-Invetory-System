import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Branch, BranchService, BranchStock } from '@app/services/branch.service';
import { ProductService, Product } from '@app/services/admin-product.service';
import { AdminService } from '@app/services/admin.service';
import { CategoryService } from '@app/services/category.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BranchProductFormComponent } from '@app/features/super-admin/branch-product-form/branch-product-form.component';
import { ProductFormComponent } from '@app/features/super-admin/product/product-form/product-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '@app/environments/environment';
import { BranchFormComponent } from '../branch-form/branch-form.component';

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class BranchManagementComponent implements OnInit {
  public apiUrl = environment.apiUrl;

  branches: Branch[] = [];
  selectedBranch: Branch | null = null;
  mainProducts: Product[] = [];
  categories: any[] = [];
  isLoading = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  pagedItems: BranchStock[] = [];
  pages: number[] = [];

  constructor(
    private branchService: BranchService,
    private productService: ProductService,
    private adminService: AdminService,
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/no-image.png'; // Fallback image
  }

  // Load branches and products
  loadData(): void {
    this.isLoading = true;

    // Load branches
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load branches');
        this.isLoading = false;
      },
    });

    // Load products
    this.loadProducts();
  }

  // Load products
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(1, '', {}).subscribe({
      next: (res) => {
        this.mainProducts = Array.isArray(res.data) ? res.data : [res.data];
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load products');
        this.isLoading = false;
      },
    });
  }

  // Load categories for the product form
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: (err) => this.showError('Failed to load categories'),
    });
  }

  selectBranch(branch: Branch): void {
    this.isLoading = true;
    this.branchService.getBranchDetails(branch._id!).subscribe({
      next: (details) => {
        this.selectedBranch = details;
        this.currentPage = 1;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load branch details');
        this.isLoading = false;
      },
    });
  }
  // Create a new branch
  createNewBranch(): void {
    const modalRef = this.modalService.open(BranchFormComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.isLoading = true;
        this.branchService.createBranch(result as Branch).subscribe({
          next: () => {
            this.loadData();
            this.showSuccess('Branch created successfully');
          },
          error: (err) => this.showError('Failed to create branch'),
        });
      }
    });
  }

  // Edit a branch
  editBranch(branch: Branch): void {
    const modalRef = this.modalService.open(BranchFormComponent);
    modalRef.componentInstance.branch = branch;
    modalRef.result.then((result) => {
      if (result) {
        this.isLoading = true;
        this.branchService.editBranchById(branch._id!, result).subscribe({
          next: () => {
            this.loadData();
            this.showSuccess('Branch updated successfully');
          },
          error: (err) => this.showError('Failed to update branch'),
        });
      }
    });
  }

  // Delete a branch
  deleteBranch(branch: Branch): void {
    Swal.fire({
      title: 'Delete Branch?',
      text: `Are you sure you want to delete ${branch.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.branchService.deleteBranchById(branch._id!).subscribe({
          next: () => {
            if (this.selectedBranch?._id === branch._id) {
              this.selectedBranch = null;
            }
            this.loadData();
            this.showSuccess('Branch deleted successfully');
          },
          error: (err) => this.showError('Failed to delete branch'),
        });
      }
    });
  }

  updatePagination(): void {
    if (!this.selectedBranch?.stock) return;

    this.totalPages = Math.ceil(this.selectedBranch.stock.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedItems = this.selectedBranch.stock.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  // Open the product form for editing
  openProductEditForm(product: Product): void {
    const modalRef = this.modalService.open(ProductFormComponent, { size: 'xl' });
    modalRef.componentInstance.product = product;
    modalRef.componentInstance.categories = this.categories;

    modalRef.result.then(
      () => {
        // Refresh data after editing
        this.loadProducts();
        if (this.selectedBranch) {
          this.selectBranch(this.selectedBranch); // Refresh branch details
        }
        Swal.fire('Success', 'Product updated successfully!', 'success');
      },
      () => {} // Handle modal dismissal
    );
  }

  // Open the branch product form for stock management
  openProductForm(stockItem?: BranchStock): void {
    if (!this.selectedBranch) {
      this.showError('No branch selected');
      return;
    }

    const modalRef = this.modalService.open(BranchProductFormComponent, { size: 'lg' });
    modalRef.componentInstance.products = this.mainProducts;
    modalRef.componentInstance.existingProductIds =
      this.selectedBranch.stock.map((i) => i.product._id) || [];
    modalRef.componentInstance.stockItem = stockItem;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.handleStockOperation(result, stockItem);
        }
      },
      () => {}
    );
  }

  handleStockOperation(data: any, existingItem?: BranchStock): void {
    this.isLoading = true;
    const operation = existingItem ? 'update' : 'create';

    const observable = existingItem
      ? this.branchService.addProductToBranch(this.selectedBranch!._id!, {
          productId: data.productId,
          quantity: data.quantity - existingItem.quantity,
        })
      : this.branchService.addProductToBranch(this.selectedBranch!._id!, data);

    observable.subscribe({
      next: () => {
        Swal.fire('Success', `Product ${operation}d successfully`, 'success');
        this.selectBranch(this.selectedBranch!); // Refresh branch details
      },
      error: (err) => {
        this.showError(err.error?.message || `${operation} failed`);
        this.isLoading = false;
      },
    });
  }

  deleteProduct(stockItem: BranchStock): void {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `Remove ${stockItem.product.name} from branch?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.branchService
          .removeProductFromBranch(this.selectedBranch!._id!, {
            productId: stockItem.product._id,
            quantity: stockItem.quantity,
          })
          .subscribe({
            next: () => {
              Swal.fire('Deleted!', 'Product removed from branch', 'success');
              this.selectBranch(this.selectedBranch!); // Refresh branch details
            },
            error: (err) => {
              this.showError('Deletion failed');
              this.isLoading = false;
            },
          });
      }
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      timer: 2000,
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message,
      timer: 3000,
    });
  }
}