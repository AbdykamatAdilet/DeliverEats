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
  totalAmount  = 0;
  deliveryFee  = 500;
  isLoading    = false;

  constructor(
    private cartService: CartService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe({
      next: (data: any) => {
        this.cartItems = data?.items ?? (Array.isArray(data) ? data : []);
        this.calculateTotal();
        this.isLoading = false;
      },
      error: () => {
        this.errorHandlerService.showError('Failed to load cart');
        this.isLoading = false;
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((acc, item) => {
      return acc + (parseFloat(item.menu_item?.price) || 0) * (item.quantity || 0);
    }, 0);
  }

  updateQuantity(item: any, change: number) {
    const newQty = item.quantity + change;
    if (newQty < 1) { this.removeItem(item.id); return; }

    item.quantity = newQty;   
    this.calculateTotal();

    this.cartService.updateQuantity(item.id, newQty).subscribe({
      error: () => {
        item.quantity -= change;  
        this.calculateTotal();
        this.errorHandlerService.showError('Failed to update quantity');
      }
    });
  }

  removeItem(id: number) {
    if (!confirm('Remove this item from cart?')) return;
    this.cartService.removeItem(id).subscribe({
      next: () => { this.errorHandlerService.showSuccess('Item removed'); this.loadCart(); },
      error: () => this.errorHandlerService.showError('Failed to remove item')
    });
  }

  clearCart() {
    if (!confirm('Clear entire cart?')) return;
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems  = [];
        this.totalAmount = 0;
        this.errorHandlerService.showSuccess('Cart cleared');
      },
      error: () => this.errorHandlerService.showError('Failed to clear cart')
    });
  }

  getTotalWithDelivery() { return this.totalAmount + this.deliveryFee; }

  confirmOrder() { this.router.navigate(['/checkout']); }
}