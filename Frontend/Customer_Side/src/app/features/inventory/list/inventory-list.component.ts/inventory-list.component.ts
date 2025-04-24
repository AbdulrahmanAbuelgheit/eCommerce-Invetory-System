// features/inventory/list/inventory-list.component.ts
import { Component } from '@angular/core';
import { InventoryService, InventoryItem } from '@app/services/inventory.service.ts.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryFormComponent } from '@app/features/inventory/form/inventory-form.component.ts/inventory-form.component';
import { TableComponent } from '@app/shared/components/table/table.component.ts/table.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent {
  inventory: InventoryItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private inventoryService: InventoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.loading = true;
    this.error = null;
    this.inventoryService.getAllItems().subscribe({
      next: (items) => {
        this.inventory = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load inventory';
        this.loading = false;
      }
    });
  }

  openInventoryForm() {
    const modalRef = this.modalService.open(InventoryFormComponent);
    modalRef.result.then(
      (result) => result === 'success' && this.loadInventory(),
      () => {}
    );
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(id).subscribe({
        next: () => this.loadInventory(),
        error: (err) => this.error = err.message || 'Delete failed'
      });
    }
  }
}