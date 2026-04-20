import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  deliveryFee: number = 500;
  isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();

    window.addEventListener('cart-updated', () => {
      this.loadCart();
    });
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
            this.cartItems = data;
        } else if (data.items) {
            this.cartItems = data.items;
        } else {
            this.cartItems = [];
        }
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorHandlerService.showError('Failed to load cart');
        this.isLoading = false;
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((acc, item) => {
      const price = item.menu_item?.price || 0;
      const quantity = item.quantity || 0;
      return acc + (price * quantity);
    }, 0);
  }

  updateQuantity(item: any, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      this.removeItem(item.id);
      return;
    }
    
    item.quantity = newQuantity;
    this.calculateTotal();
  }

  removeItem(id: number) {
    if (confirm('Remove this item from cart?')) {
      this.cartService.removeItem(id).subscribe({
        next: () => {
          this.loadCart();
          this.errorHandlerService.showSuccess('Item removed from cart');
        },
        error: () => {
          this.errorHandlerService.showError('Failed to remove item');
        }
      });
    }
  }

  clearCart() {
    if (confirm('Clear entire cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCart();
          this.errorHandlerService.showSuccess('Cart cleared');
        },
        error: () => {
          this.errorHandlerService.showError('Failed to clear cart');
        }
      });
    }
  }

  getTotalWithDelivery(): number {
    return this.totalAmount + this.deliveryFee;
  }

  confirmOrder() {
    if (this.cartItems.length === 0) {
      this.errorHandlerService.showError('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}