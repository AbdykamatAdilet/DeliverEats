import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotal();
      },
      error: (err) => console.error('Ошибка загрузки корзины', err)
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((acc, item) => acc + (item.menu_item.price * item.quantity), 0);
  }

  removeItem(id: number) {
    this.cartService.removeItem(id).subscribe(() => this.loadCart());
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => this.loadCart());
  }

  confirmOrder() {
    alert('Заказ оформлен! Проверьте вкладку заказов.');
    // Здесь будет вызов твоего process_checkout на бэкенде
  }
}