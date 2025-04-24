// features/admin/shared/address-list.component.ts
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService, Address } from '@app/services/admin.service';
import { AddressFormComponent } from '@app/features/super-admin/shared/address-form/address-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-list',
  imports: [CommonModule, /* other imports */],

  template: `
    <div class="mt-4">
      <h5>Addresses</h5>
      <div class="list-group">
        <div *ngFor="let address of addresses" class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              {{ address.street }}, {{ address.city }}<br>
              {{ address.gov }} {{ address.zipCode }}
            </div>
            <!-- <button class="btn btn-sm btn-outline-danger" (click)="deleteAddress(address)">
              Delete
            </button> -->
          </div>
        </div>
      </div>
      <button class="btn btn-sm btn-primary mt-2" (click)="openAddressForm()">
        Add Address
      </button>
    </div>
  `
})
export class AddressListComponent {
  @Input() entityId!: string;
  @Input() entityType!: 'customer' | 'seller';
  addresses: Address[] = [];
  loading = false;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading = true;
    this.adminService.getAddresses(this.entityType, this.entityId).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load addresses:', error);
        this.loading = false;
      }
    });
  }

  openAddressForm() {
    const modalRef = this.modalService.open(AddressFormComponent);
    modalRef.componentInstance.entityId = this.entityId;
    modalRef.componentInstance.entityType = this.entityType;
    modalRef.result.then(() => this.loadAddresses());
  }


}