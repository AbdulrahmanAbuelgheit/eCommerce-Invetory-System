import { Component } from '@angular/core';
import { AdminService, Seller } from '@app/services/admin.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SellerFormComponent } from '@app/features/super-admin/sellers/seller-form/seller-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule],
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.scss']
})
export class SellerListComponent {
  sellers: Seller[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  searchQuery = '';
  searchSubject = new Subject<string>();

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.refreshSellers());
  }

  ngOnInit() {
    this.refreshSellers();
  }

  refreshSellers() {
    this.adminService.getSellers(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (response) => {
          this.sellers = response.data;
          // this.totalItems = response.total;
        },
        error: (error) => {
          console.error('Seller load error:', error);
          Swal.fire('Error', 'Failed to load sellers', 'error');
        }
      });
  }

  openSellerForm(seller?: Seller) {
    const modalRef = this.modalService.open(SellerFormComponent);
    modalRef.componentInstance.seller = seller ? { ...seller } : undefined;

    modalRef.result.then(() => {
      this.refreshSellers();
      Swal.fire('Success', seller ? 'Seller updated!' : 'Seller created!', 'success');
    }).catch(() => {});
  }

  deleteSeller(id: string) {
    Swal.fire({
      title: 'Delete Seller?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteSeller(id).subscribe({
          next: () => {
            this.refreshSellers();
            Swal.fire('Deleted!', 'Seller has been removed.', 'success');
          },
          error: (error) => Swal.fire('Error', error.error?.message || 'Delete failed', 'error')
        });
      }
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.refreshSellers();
  }
}