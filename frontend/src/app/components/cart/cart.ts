import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart', err);
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
    console.log('Quantity updated');
  }

  removeItem(id: number) {
    if (confirm('Remove this item from cart?')) {
      this.cartService.removeItem(id).subscribe({
        next: () => {
          this.loadCart();
          console.log('Item removed');
        },
        error: () => {
          console.error('Failed to remove item');
        }
      });
    }
  }

  clearCart() {
    if (confirm('Clear entire cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCart();
          console.log('Cart cleared');
        },
        error: () => {
          console.error('Failed to clear cart');
        }
      });
    }
  }

  getTotalWithDelivery(): number {
    return this.totalAmount + this.deliveryFee;
  }

  confirmOrder() {
    if (this.cartItems.length === 0) {
      console.error('Your cart is empty');
      return;
    }
    // Will connect to checkout
    console.log('Proceed to checkout');
  }
}