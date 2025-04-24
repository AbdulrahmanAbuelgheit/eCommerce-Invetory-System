import { Component } from '@angular/core';
import { AdminService, Manager } from '@app/services/admin.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ManagerFormComponent } from '@app/features/super-admin/managers/manager-form/manager-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manager-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule],
  templateUrl: './manager-list.component.html',
  styleUrls: ['./manager-list.component.scss']
})
export class ManagerListComponent {
  managers: Manager[] = [];
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
    ).subscribe(() => this.refreshManagers());
  }

  ngOnInit() {
    this.refreshManagers();
  }
getBranchName(branchId: string | { _id: string; name: string }): string {
    if (!branchId) return 'No branch assigned'; // Handle null/undefined
    return typeof branchId === 'object' ? branchId.name : 'No branch assigned';
  }
  refreshManagers() {
    this.adminService.getManagers(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (response) => {
          this.managers = response.data;
          // this.totalItems = response.total;
        },
        error: (error) => {
          console.error('Manager load error:', error);
          Swal.fire('Error', 'Failed to load managers', 'error');
        }
      });
  }

  openManagerForm(manager?: Manager) {
    const modalRef = this.modalService.open(ManagerFormComponent);
    modalRef.componentInstance.manager = manager ? { ...manager } : undefined;

    modalRef.result.then(() => {
      this.refreshManagers();
      Swal.fire('Success', manager ? 'Manager updated!' : 'Manager created!', 'success');
    }).catch(() => {});
  }

  deleteManager(id: string) {
    Swal.fire({
      title: 'Delete Manager?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteManager(id).subscribe({
          next: () => {
            this.refreshManagers();
            Swal.fire('Deleted!', 'Manager has been removed.', 'success');
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
    this.refreshManagers();
  }
}