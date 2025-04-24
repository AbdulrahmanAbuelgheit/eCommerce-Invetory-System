import { Component } from '@angular/core';
import { AdminService, Cashier } from '@app/services/admin.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CashierFormComponent } from '@app/features/super-admin/cashiers/cashier-form.component.ts/cashier-form.component';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cashier-list',
  standalone: true,
  imports: [CommonModule,NgbPaginationModule,FormsModule ],
  templateUrl: './cashier-list.component.html',
  styleUrls: ['./cashier-list.component.scss']
})
export class CashierListComponent {
  cashiers$: Observable<Cashier[]>;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  searchTerm = '';
  searchSubject = new Subject<string>();

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal
  ) {
    this.cashiers$ = this.adminService.getCashiers(this.currentPage, this.itemsPerPage, this.searchTerm).pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Invalid response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error loading cashiers:', error);
        return of([]);
      })
    );

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.refreshCashiers());
  }
  getBranchName(branchId: string | { _id: string; name: string }): string {
    if (!branchId) return 'No branch assigned'; // Handle null/undefined
    return typeof branchId === 'object' ? branchId.name : 'No branch assigned';
  }

  refreshCashiers() {
    this.cashiers$ = this.adminService.getCashiers(this.currentPage, this.itemsPerPage, this.searchTerm).pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Invalid response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error refreshing cashiers:', error);
        Swal.fire('Error', 'Failed to refresh the cashier list.', 'error');
        return of([]);
      })
    );
  }

  openCashierForm(cashier?: Cashier) {
    const modalRef = this.modalService.open(CashierFormComponent);
    modalRef.componentInstance.cashier = cashier ? { ...cashier } : undefined;

    modalRef.result.then(() => {
      this.refreshCashiers();
      Swal.fire('Success', cashier ? 'Cashier updated!' : 'Cashier created!', 'success');
    }).catch(() => {});
  }

  deleteCashier(id: string) {
    Swal.fire({
      title: 'Delete Cashier?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteCashier(id).subscribe({
          next: () => {
            this.refreshCashiers();
            Swal.fire('Deleted!', 'Cashier has been removed.', 'success');
          },
          error: (error) => Swal.fire('Error', error.error?.message || 'Delete failed', 'error')
        });
      }
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.refreshCashiers();
  }
}