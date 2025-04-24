// src/app/services/cart.service.ts
import { Injectable, signal, effect } from '@angular/core';
import { IProduct } from '../models/product';
import { ICartItem } from '../models/cart-item';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { CustomerService } from './customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

export interface ApiCartItem {
  userId?: string;
  productId: string;
  quantity: number;
}

interface ApiCartResponse {
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_KEY = 'cart';
  cartItems = signal<ICartItem[]>([]);
  private apiUrl = 'http://localhost:7777';
  tempCart: ApiCartItem = {
    productId: '',
    quantity: 0,
  };

  private userId: string='';

  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private cutomerService: CustomerService,
    private snackbar: MatSnackBar
  ) {
    this.initializeCart();
  }

  getUserId(): void {
    this.cutomerService.getCustomerData().subscribe({
      next: (data) => {
        //console.log("ID:::::"+data.data._id);
        this.userId = data.data._id;
        //console.log("ID:::::"+this.userId);
      },
      error: (err) => console.error('Failed to fetch user:', err),
    });
  }

  //initialize cart based on user authentication
  public initializeCart(): void {
    if (this.userService.isAuthenticated()) {
      this.fetchCartFromApi();
      console.log("api");
    } else {
      this.loadCartFromLocalStorage();
      console.log("local"+this.userService.isAuthenticated());
    }
  }

  //Get cart from DataBase if logged in
  private fetchCartFromApi(): void {
    this.http.get<any>(`${this.apiUrl}/carts`).subscribe({
      next: (response) => this.updateCartFromApiResponse(response),
      error: (err) => console.error('Failed to fetch cart:', err)
    });
  }

  private updateCartFromApiResponse(response:any): void {
    const updatedCart:ICartItem[] = response.data.cart.products
    .map((item: any) => ({
      _id: item.productId._id,
      name: item.productId.name, // Fetch product details if needed
      soldPrice: item.productId.soldPrice, // Fetch product details if needed
      quantity: item.quantity,
      description: item.productId.description,
      images: item.productId.images,
      categoryName: item.productId.categoryName,
      mainStock: item.productId.mainStock,
    }));
    console.log("updatedCart"+updatedCart[0]._id);
    this.cartItems.set(updatedCart);
    console.log("updatedCart"+this.cartItems);

  }

  //Get cart from LocalStorage if a guest
  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem(this.CART_KEY);
    if (storedCart) {
      this.cartItems.set(JSON.parse(storedCart));
    }
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems()));
  }

  private notifyUser(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'snackbar-notification'
    });
  }


  private compareCartWithResponse(response: ApiCartResponse[]): void {
    const serverCart = new Map(response.map(item => [item.productId, item.quantity]));
    const localCart = new Map(this.cartItems().map(item => [item._id, item.quantity]));

    // Check for removed items
    const removedItems = this.cartItems().filter(item => !serverCart.has(item._id));
    if (removedItems.length > 0) {
      this.notifyUser('Some items were removed from your cart due to stock unavailability.');
    }

    // Check for quantity changes
    const adjustedItems = this.cartItems()
      .filter(item => serverCart.has(item._id) && serverCart.get(item._id)! !== item.quantity)
      .map(item => ({
        id: item._id,
        name: item.name,
        oldQuantity: item.quantity,
        newQuantity: serverCart.get(item._id)!
      }));

    if (adjustedItems.length > 0) {
      const message = adjustedItems
        .map(item => `${item.name}: Quantity adjusted from ${item.oldQuantity} to ${item.newQuantity}`)
        .join(', ');
      this.notifyUser(`Quantities adjusted: ${message}`);
    }

    // Update cart with server response
    this.updateCartFromApiResponse(response);
  }

  private updateCartOnApi(item: ApiCartItem, action: 'add' | 'remove' | 'edit'): void {
    const endpoint = action === 'add' ? 'add' : action === 'remove' ? 'remove' : 'edit';
    this.http.post<ApiCartResponse[]>(`${this.apiUrl}/carts/${endpoint}`, item).subscribe({
      next: (response) => {
        this.compareCartWithResponse(response); // Compare and notify user
      },
      error: (err) => {
        console.error('Failed to update cart:', err);
        Swal.fire('Error', 'Some of the product You are trying to add are out of stock.', 'error');
        this.initializeCart(); // Reset cart to last known state
      }
    });
  }

   addToCart(item: ICartItem): void {
    // Optimistic update
    const existingItem = this.cartItems().find(i => i._id === item._id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.cartItems.update(items => [...items]);
    } else {
      this.cartItems.update(items => [...items, item]);
    }

    this.getUserId();
    this.tempCart.userId = this.userId;
    this.tempCart.productId = item._id;
    this.tempCart.quantity = item.quantity;

    if (this.userService.isAuthenticated()) {
      this.updateCartOnApi(this.tempCart, 'add');
    } else {
      this.saveCartToLocalStorage();
    }
  }

  async removeFromCart(itemId: string): Promise<void> {
    // Optimistic update
    this.cartItems.update(items => items.filter(i => i._id !== itemId));
    this.getUserId();
    this.tempCart.userId = this.userId;
    this.tempCart.productId = itemId;
    this.tempCart.quantity = 0;

    if (this.userService.isAuthenticated()) {
      this.updateCartOnApi(this.tempCart, 'remove');
    } else {
      this.saveCartToLocalStorage();
    }
  }

  updateQuantity(itemId: string, quantity: number): void {
    // Optimistic update
    this.cartItems.update(items => 
      items.map(i => i._id === itemId ? { ...i, quantity } : i)
    );

    this.getUserId();
    this.tempCart.userId = this.userId;
    this.tempCart.productId = itemId;
    this.tempCart.quantity = quantity;

    if (this.userService.isAuthenticated()) {
      this.updateCartOnApi(this.tempCart, 'edit');
    } else {
      this.saveCartToLocalStorage();
    }
  }

  getCartTotal(): number {
    return this.cartItems().reduce((total, item) => total + (item.soldPrice * item.quantity), 0);
  }

  clearCart(): void {
    // Optimistic update
    this.cartItems.set([]);

    if (this.userService.isAuthenticated()) {
      this.http.delete<ApiCartResponse[]>(`${this.apiUrl}/carts/empty`, {}).subscribe({
        next: (response) => this.compareCartWithResponse(response),
        error: (err) => console.error('Failed to clear cart:', err)
      });
    } else {
      localStorage.removeItem(this.CART_KEY);
    }
  }


  fetchCartFromApiWithoutCompare(): Observable<any> {
    return this.http.get('http://localhost:7777/carts');
  }
}
  // private getStoredCartItems(): ICartItem[] {
  //   try {
  //     const storedCart = localStorage.getItem('cart');
  //     return storedCart ? JSON.parse(storedCart) : [];
  //   } catch (error) {
  //     console.error('Error loading cart from localStorage:', error);
  //     return [];
  //   }
  // }

  // addToCart(product: ICartItem): void {
  //   const existingItem = this.cartItems().find(item => item._id === product._id);

  //   if (existingItem) {
  //     // Check if incrementing would exceed available quantity
  //     if (existingItem.quantity + 1 > existingItem.mainStock) {
  //       this.showQuantityError(product.name, existingItem.mainStock);
  //       return;
  //     }
  //     existingItem.quantity += product.quantity;
  //     this.cartItems.update(items => [...items]);
  //   } else {
  //     // Check if product has available stock
  //     if (product.mainStock < 1) {
  //       this.showOutOfStockError(product.name);
  //       return;
  //     }
  //     this.cartItems.update(items => [
  //       ...items,
  //       {
  //         ...product,
  //         quantity: 1,
  //         mainStock: product.mainStock
  //       }
  //     ]);
  //   }
  // }

  // removeFromCart(productId: string): void {
  //   this.cartItems.update(items => items.filter(item => item._id !== productId));
  // }

  // updateQuantity(productId: string, newQuantity: number): void {
  //   const item = this.cartItems().find(item => item._id === productId);
  //   if (!item) return;

  //   if (newQuantity > item.mainStock) {
  //     this.showQuantityError(item.name, item.mainStock);
  //     return;
  //   }

  //   if (newQuantity < 1) {
  //     this.cartItems.update(items => items.filter(i => i._id !== productId));
  //     return;
  //   }

  //   this.cartItems.update(items =>
  //     items.map(i =>
  //       i._id === productId ? { ...i, quantity: newQuantity } : i
  //     )
  //   );
  // }

  // getTotal(): number {
  //   return this.cartItems().reduce((acc, item) => acc + (item.soldPrice * item.quantity), 0);
  // }

  // private showQuantityError(productName: string, max: number): void {
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Quantity Exceeded',
  //     html: `Only <b>${max}</b> ${productName} available in stock!`,
  //     confirmButtonColor: '#3085d6'
  //   });
  // }

  // private showOutOfStockError(productName: string): void {
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Out of Stock',
  //     html: `<b>${productName}</b> is currently unavailable!`,
  //     confirmButtonColor: '#3085d6'
  //   });
  // }


