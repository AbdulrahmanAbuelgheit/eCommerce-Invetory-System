import { Component } from '@angular/core';
import { AdminService, Customer } from '@app/services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerFormComponent } from '@app/features/super-admin/customers/customer-form.component.ts/customer-form.component';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent {
  customers$: Observable<Customer[]>;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal
  ) {
    this.customers$ = this.adminService.getCustomers().pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Invalid response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error loading customers:', error);
        return of([]);
      })
    );
  }

  openCustomerForm(customer?: Customer) {
    const modalRef = this.modalService.open(CustomerFormComponent);
    modalRef.componentInstance.customer = customer ? { ...customer } : undefined;

    modalRef.result.then(() => {
      this.refreshCustomers();
      Swal.fire('Success', customer ? 'Customer updated!' : 'Customer created!', 'success');
    }).catch(() => {});
  }

  refreshCustomers() {
    this.customers$ = this.adminService.getCustomers().pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Invalid response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error refreshing customers:', error);
        Swal.fire('Error', 'Failed to refresh the customer list.', 'error');
        return of([]);
      })
    );
  }

  deleteCustomer(id: string) {
    Swal.fire({
      title: 'Delete Customer?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteCustomer(id).subscribe({
          next: () => {
            this.refreshCustomers();
            Swal.fire('Deleted!', 'Customer has been removed.', 'success');
          },
          error: (error) => Swal.fire('Error', error.error?.message || 'Delete failed', 'error')
        });
      }
    });
  }
}