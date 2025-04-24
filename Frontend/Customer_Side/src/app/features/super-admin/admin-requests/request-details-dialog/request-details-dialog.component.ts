import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-request-details-dialog',
  imports:[CommonModule, MatDialogModule, MatTableModule],
  templateUrl: './request-details-dialog.component.html',
  styleUrls: ['./request-details-dialog.component.scss'],
})
export class RequestDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}