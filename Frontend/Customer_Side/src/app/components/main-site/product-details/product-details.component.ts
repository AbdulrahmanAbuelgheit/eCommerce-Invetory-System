import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { IProduct } from '@app/models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICartItem } from '@app/models/cart-item';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  product: IProduct = {
    _id: '123',
    name: 'Sample Product',
    soldPrice: 99.99,
    description: 'This is a sample product description.',
    categoryName: 'Electronics',
    mainStock: 10,
    images: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600/FF0000',
      'https://via.placeholder.com/800x600/00FF00',
    ],
  };

  selectedQuantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductDetails(productId);
    }
  }

  fetchProductDetails(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        this.product = response.data;
        this.validateQuantity(); // Validate quantity after fetching product details
      },
      error: (err) => {
        console.error('Failed to fetch product details:', err);
      },
    });
  }

  // Validate the selected quantity
  validateQuantity(): void {
    if (this.selectedQuantity < 1) {
      this.selectedQuantity = 1;
    } else if (this.selectedQuantity > this.product.mainStock) {
      this.selectedQuantity = this.product.mainStock;
    }
  }

  // Handle quantity change
  onQuantityChange(): void {
    setTimeout(() => {
      this.validateQuantity();
    });
  }

  // Handle blur event (when the input loses focus)
  onQuantityBlur(): void {
    this.validateQuantity();
  }

  async addToCart(): Promise<void> {
    const cartItem: ICartItem = {
      _id: this.product._id,
      name: this.product.name,
      soldPrice: this.product.soldPrice,
      description: this.product.description,
      images: this.product.images,
      mainStock: this.product.mainStock,
      quantity: this.selectedQuantity,
      categoryName: this.product.categoryName,
    };
    const result = await this.alertService.confirmAddToCart(cartItem.name);
    if (result.isConfirmed) {
      this.cartService.addToCart(cartItem);
      console.log('Product added to cart:', cartItem);
    }
  }
}