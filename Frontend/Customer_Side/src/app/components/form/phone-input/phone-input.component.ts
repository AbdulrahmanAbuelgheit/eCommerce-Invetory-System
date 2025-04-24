// phone-input.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.css']
})
export class PhoneInputComponent {
  phoneControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^01[0-2]\d{8}$/)
  ]);

  @Output() phoneChange = new EventEmitter<string>();

  ngOnInit() {
    this.phoneControl.valueChanges.subscribe(value => {
      if (this.phoneControl.valid) {
        this.phoneChange.emit(value!);
      }
    });
  }
}