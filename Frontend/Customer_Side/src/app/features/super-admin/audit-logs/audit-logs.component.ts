// audit-logs.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableComponent } from '@app/shared/components/table/table.component.ts/table.component';
// import { AuditService } from '@app/services/audit.service';

@Component({
  imports: [CommonModule, TableComponent],

  template: `
    <!-- <div class="card">
      <h3>Audit Logs</h3>
      <app-table [data]="logs$ | async"></app-table>
    </div> -->
  `
})
export class AuditLogsComponent {
  // logs$ = this.auditService.getLogs();
  
  // constructor(private auditService: AuditService) {}
}