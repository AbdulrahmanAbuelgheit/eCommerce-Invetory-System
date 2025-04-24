// checkout.component.ts
import { Component, inject } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder , FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CartComponent } from '../cart/cart.component';
import { CommonModule } from '@angular/common';
import { AddressInputComponent } from '../../form/address-input/address-input.component';
import { CustomerService } from '@app/services/customer.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule,CartComponent,CommonModule,ReactiveFormsModule,AddressInputComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  currentStep = 1;

  //shiping info
  shippingInfo = {
    phone: '',
    address: null
  };

  onPhoneChange(phone: string) {
    this.shippingInfo.phone = phone;
  }

  onAddressChange(address: any) {
    this.shippingInfo.address = address;
  }

  

  //payment
  paymentMethod = 'cash'; // Default to cash
  cardDetails = {
    number: '',
    expiry: '',
    cvv: ''
  };

  //sevices
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);
  customerService = inject(CustomerService);


  //addressess
  addresses:any = [];
  selectedAddress = null;
  public isAddingNewAddress: boolean = false;

  customerNotes: string = 'No notes';

// Add this method
public addNewAddress(): void {
    this.isAddingNewAddress = true;
    this.selectedAddress = null;
}

public onAddressAdded(): void {
  this.getAddresses(); // Refresh the addresses list
  this.isAddingNewAddress = false; // Hide the address input form
}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAddresses();
    console.log(this.addresses);
  }

  getAddresses() {
    this.customerService.getCustomerAddresses().subscribe({
      next: (response) => {
        this.addresses = response.data;
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to fetch addresses', 'error');
      }
    });
  }

  //constructor
  constructor() {
    
  }


  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }

  isStepValid(): boolean {
    if (this.currentStep === 1) {
      return this.selectedAddress != null ;
    } else if (this.currentStep === 2) {
      return this.paymentMethod === 'Cash' || this.paymentMethod === 'Card'
    } else {
      return false;
    }
  }

  async placeOrder() {
    try {
      console.log('Placing order');
      // First step: Validate cart
      const cartResponse = await this.cartService.fetchCartFromApiWithoutCompare().toPromise();
      const apiCart = cartResponse.data.cart.products;
      const currentCart = this.cartService.cartItems();
  
      // Check for quantity discrepancies
      const hasChanges = currentCart.some(currentItem => {
        const apiItem = apiCart.find((item: { _id: string; }) => item._id === currentItem._id);
        return apiItem && apiItem.quantity !== currentItem.quantity;
      });
      console.log('Placing order22');
  
      if (hasChanges) {
        await Swal.fire({
          title: 'Cart Updated',
          text: 'Some items in your cart have been modified. Please review your cart.',
          icon: 'warning',
          confirmButtonText: 'Review Cart'
        });
        this.router.navigate(['/cart']);
        return;
      }
      else
      {
        console.log('Cart is valid');
      }
  
      // Second step: Place order
      const orderData = {
        paymentMethod: this.paymentMethod,
        addressIndex: this.selectedAddress,
        customerNotes: this.customerNotes || '',
        products: currentCart.map(item => ({
          _id: item._id,
          quantity: item.quantity
        }))
      };

      if (orderData.customerNotes == null|| this.customerNotes == '') {
        orderData.customerNotes = 'No notes';
      }
  
      const response = await this.orderService.createOrder(orderData).toPromise();
      
      await Swal.fire({
        title: 'Success',
        text: 'Order placed successfully!',
        icon: 'success'
      });
  
      this.cartService.clearCart();
      this.router.navigate(['/']);
  
    } catch (error) {
      Swal.fire('Error', 'Failed to place order', 'error');
    }
  }
}





