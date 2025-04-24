// src/app/services/alert.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  confirmAddToCart(productName: string) {
    return Swal.fire({
      title: 'Add to Cart?',
      html: `Add <b>${productName}</b> to your shopping cart?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!'
    });
  }
}