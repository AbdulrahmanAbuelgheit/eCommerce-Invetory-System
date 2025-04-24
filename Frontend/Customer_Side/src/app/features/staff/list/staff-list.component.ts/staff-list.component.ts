// features/staff/list/staff-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService, Staff } from '@app/services/staff.service.ts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffFormComponent } from '@app/features/staff/form/staff-form.component.ts/staff-form.component';
import { TableComponent } from '@app/shared/components/table/table.component.ts/table.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, TableComponent, RouterModule],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent {
  staff: Staff[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private staffService: StaffService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.loading = true;
    this.error = null;
    this.staffService.getAllStaff().subscribe({
      next: (staff) => {
        this.staff = staff;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load staff';
        this.loading = false;
      }
    });
  }

  openStaffForm() {
    const modalRef = this.modalService.open(StaffFormComponent);
    modalRef.result.then(
      (result) => result === 'success' && this.loadStaff(),
      () => {}
    );
  }

  deleteStaff(id: number) {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => this.loadStaff(),
        error: (err) => this.error = err.message || 'Delete failed'
      });
    }
  }
}