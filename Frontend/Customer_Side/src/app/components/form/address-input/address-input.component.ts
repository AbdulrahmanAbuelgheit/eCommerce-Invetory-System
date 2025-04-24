// address-input.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '@app/services/customer.service';
import { zip } from 'rxjs';

@Component({
  selector: 'app-address-input',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl:  './address-input.component.html',
  styleUrls: ['./address-input.component.css']
})
export class AddressInputComponent {
  addressForm: FormGroup;
  governorates = [
    'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira',
    'Fayoum', 'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qaliubia',
    'New Valley', 'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said',
    'Damietta', 'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matrouh',
    'Luxor', 'Qena', 'North Sinai', 'Sohag'
  ];

  @Output() addressChange = new EventEmitter<any>();
  @Output() addressAdded = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    this.addressForm = this.fb.group({
      gov: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      zipCode: ['', Validators.required]
    });

    // this.addressForm.valueChanges.subscribe(value => {
    //   if (this.addressForm.valid) {
    //     this.addressChange.emit(value);
    //   }
    // });
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.addressChange.emit(this.addressForm.value);
      this.customerService.addCustomerAddress(this.addressForm.value).subscribe({
        next: () => {
          this.addressForm.reset();
          this.addressAdded.emit(); // Emit event when address is added
        }
      });
    }
  }
}