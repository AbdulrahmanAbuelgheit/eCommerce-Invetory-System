import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import DataTables, { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { BranchDataService } from '@app/services/branch-data.service';


@Component({
  selector: 'app-manager-staff',
  imports: [CommonModule,DataTablesModule,FormsModule,DataTablesModule],
  templateUrl: './manager-staff.component.html',
  styleUrls: ['./manager-staff.component.scss'],
})
export class ManagerStaffComponent implements OnInit {

  //DataTables variable
   


  cashiers: any[] = [];
  newCashier: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone1: '',
    SSN: '',
    password: '',
    branchId: JSON.parse(localStorage.getItem('branchId')!)? JSON.parse(localStorage.getItem('branchId')!): "67b49312a4f5aae746408283", // Static branchId
  };
  selectedCashier: any = {};
  branchId: string = '';
  branchName: string = '';

  constructor(
    private http: HttpClient, 
    private modalService: NgbModal,
    private branchDataService: BranchDataService
  ) {}

  dtflag:boolean =false;
  dtOptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();
  ngOnInit(): void {


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [
        {
          targets: 0, // First column (index)
          searchable: false,
          orderable: false,
        }
      ]
      
    };
    

    // Subscribe to branch data
    this.branchDataService.currentBranchId.subscribe(id => {
      if (id) {
        this.branchId = id;
        this.newCashier.branchId = id;
      }
    });
    
    this.branchDataService.currentBranchName.subscribe(name => {
      this.branchName = name;
    });

    this.fetchCashiers();
  }

  // Fetch cashiers from the API
  fetchCashiers(): void {
    this.http.get('http://localhost:7777/cashiers/my-branch-cashiers').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cashiers = response.data;
  
          // Destroy the existing DataTable instance if it exists
          if ($.fn.DataTable.isDataTable('#cashiersTable')) {
            $('#cashiersTable').DataTable().destroy();
          }
  
          // Reinitialize the DataTable
          this.dttrigger.next(null);
          this.dtflag = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch cashiers:', err);
      },
    });
  }

  // Open the "Add Cashier" modal
  openAddCashierModal(content: TemplateRef<any>): void {
    this.modalService.open(content, { centered: true });
  }

   // Add a new cashier
   addCashier(): void {
    const payload = {
      firstName: this.newCashier.firstName,
      lastName: this.newCashier.lastName,
      email: this.newCashier.email,
      password: this.newCashier.password,
      phone1: this.newCashier.phone1,
      SSN: this.newCashier.SSN,
      branchId: this.branchId,
    };
  
    this.http.post('http://localhost:7777/cashiers', payload).subscribe({
      next: () => {
        this.fetchCashiers(); // Refresh the list
        this.modalService.dismissAll(); // Close the modal
        this.newCashier = {
          firstName: '',
          lastName: '',
          email: '',
          phone1: '',
          SSN: '',
          password: '',
          branchId: this.branchId,
        }; // Reset the form
      },
      error: (err) => {
        console.error('Failed to add cashier:', err);
      },
    });
  }

  // Open the "Update Cashier" modal
  openUpdateCashierModal(cashier: any, content: TemplateRef<any>): void {
    this.selectedCashier = { ...cashier }; // Copy the selected cashier
    this.modalService.open(content, { centered: true });
  }

  // Update a cashier
  updateCashier(): void {
    const cashierId = this.selectedCashier._id;
    const updatedData = {
      firstName: this.selectedCashier.firstName,
      lastName: this.selectedCashier.lastName,
      email: this.selectedCashier.email,
      phone1: this.selectedCashier.phone1,
    };
  
    this.http.put(`http://localhost:7777/cashiers/${cashierId}`, updatedData).subscribe({
      next: () => {
        this.fetchCashiers(); // Refresh the list
        this.modalService.dismissAll(); // Close the modal
      },
      error: (err) => {
        console.error('Failed to update cashier:', err);
      },
    });
  }

  // Delete a cashier
  deleteCashier(cashierId: string): void {
    if (confirm('Are you sure you want to delete this cashier?')) {
      this.http.delete(`http://localhost:7777/cashiers/${cashierId}`).subscribe({
        next: () => {
          this.fetchCashiers(); // Refresh the list
        },
        error: (err) => {
          console.error('Failed to delete cashier:', err);
        },
      });
    }
  }
}