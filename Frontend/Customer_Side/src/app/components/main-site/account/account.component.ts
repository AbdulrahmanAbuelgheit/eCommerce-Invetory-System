import { Component } from '@angular/core';
import { AddressInputComponent } from '../../form/address-input/address-input.component';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { AccountUpdateComponent } from "./account-update/account-update.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AddressInputComponent, CommonModule, FormsModule, AccountUpdateComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  // Static data for now
  userData: any = {};
  phoneNumbers: string[] = [];
  addresses: any[] = [
    {
      governorate: 'Cairo',
      city: 'Nasr City',
      addressDetails: '123 Main St, Building 5, Apt 12'
    },
    {
      governorate: 'Giza',
      city: '6th of October',
      addressDetails: '456 Side St, Building 10, Apt 3'
    }
  ];
  tempAddress: any = {};


  //image 
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;


  showModal = false;

  constructor(
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.customerService.getCustomerData().subscribe((data) => {
      this.userData = data.data;
      this.phoneNumbers.push(data.data.phone1);
      this.addresses=data.data.addresses;
      console.log("userphone: "+this.phoneNumbers);
    });
  }

  openUpdateModal(): void {
    this.showModal = true;
  }

  closeUpdateModal(): void {
    this.showModal = false;
  }


  // // Add a new phone number
  // addPhone(phone: string): void {
  //   if (!this.phoneNumbers.includes(phone)) {
  //     this.phoneNumbers.push(phone);
  //   }
  // }

  // // Remove a phone number
  // removePhone(phone: string): void {
  //   this.phoneNumbers = this.phoneNumbers.filter(p => p !== phone);
  // }


  // Add a new address
  loadAddresses(address: any): void {
    console.log(address);
    this.addresses.push(address);
  }

  // Remove an address
  removeAddress(address: any,index: any): void {
    this.addresses = this.addresses.filter(a => a !== address);
    this.customerService.deleteCustomerAddress(index).subscribe((data) => {
      console.log(data);
    });

    
  }
}