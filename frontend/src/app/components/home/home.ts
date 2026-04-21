import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  searchText = '';
  activeCategory = '';
  cartCount = 0;
  cartItems: any[] = [];
  address = '';
  isEditingAddress = false;

  categories = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'hot',       name: 'Hot Dishes' },
    { id: 'soup',      name: 'Soups' },
    { id: 'salads',    name: 'Salads' },
    { id: 'sideDish',  name: 'Side Dishes' },
    { id: 'dessert',   name: 'Desserts' },
    { id: 'drinks',    name: 'Drinks' },
  ];

  menuItems = [
    { id: 1,  name: 'Omelette',        price: 1200, category: 'breakfast' },
    { id: 2,  name: 'Pancakes',        price: 850,  category: 'breakfast' },
    { id: 3,  name: 'Cottage Cheese',  price: 1150, category: 'breakfast' },
    { id: 4,  name: 'Rice Porridge',   price: 900,  category: 'breakfast' },
    { id: 5,  name: 'Oatmeal',         price: 1000, category: 'breakfast' },
    { id: 6,  name: 'Fried Eggs',      price: 900,  category: 'breakfast' },
    { id: 7,  name: 'Steak',           price: 3500, category: 'hot' },
    { id: 8,  name: 'Chicken Steak',   price: 2800, category: 'hot' },
    { id: 9,  name: 'Pasta',           price: 3200, category: 'hot' },
    { id: 10, name: 'Lagman',          price: 2200, category: 'hot' },
    { id: 11, name: 'Plov',            price: 2500, category: 'hot' },
    { id: 12, name: 'Beshbarmak',      price: 3800, category: 'hot' },
    { id: 13, name: 'Borsch',          price: 1500, category: 'soup' },
    { id: 14, name: 'Chicken Soup',    price: 1300, category: 'soup' },
    { id: 15, name: 'Caesar Salad',    price: 1800, category: 'salads' },
    { id: 16, name: 'Greek Salad',     price: 1600, category: 'salads' },
    { id: 17, name: 'Mashed Potatoes', price: 700,  category: 'sideDish' },
    { id: 18, name: 'French Fries',    price: 800,  category: 'sideDish' },
    { id: 19, name: 'Cheesecake',      price: 1200, category: 'dessert' },
    { id: 20, name: 'Ice Cream',       price: 900,  category: 'dessert' },
    { id: 21, name: 'Green Tea',       price: 500,  category: 'drinks' },
    { id: 22, name: 'Fresh Juice',     price: 900,  category: 'drinks' },
  ];

  constructor(
    private cartService: CartService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    const saved = localStorage.getItem('address');
    if (saved) this.address = saved;
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (response: any) => {
        const items: any[] = response?.items ?? (Array.isArray(response) ? response : []);
        this.cartItems = items;
        this.cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      },
      error: () => {
        this.cartCount = 0;
        this.cartItems = [];
      }
    });
  }

  getFilteredItemsByCategory(categoryId: string) {
    let items = this.menuItems.filter(item => item.category === categoryId);
    if (this.searchText) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    return items;
  }

  addToCart(item: any) {
    const existing = this.cartItems.find(ci => ci.menu_item?.id === item.id);
    if (existing) {
      this.cartService.updateQuantity(existing.id, existing.quantity + 1).subscribe({
        next: () => this.loadCartItems(),
        error: () => this.errorHandler.showError('Failed to update cart')
      });
    } else {
      this.cartService.addToCart(item.id, 1).subscribe({
        next: () => {
          this.errorHandler.showSuccess(`${item.name} added to cart!`);
          this.loadCartItems();
        },
        error: () => this.errorHandler.showError('Failed to add to cart')
      });
    }
  }

  decrease(item: any) {
    const existing = this.cartItems.find(ci => ci.menu_item?.id === item.id);
    if (!existing) return;

    if (existing.quantity <= 1) {
      this.cartService.removeItem(existing.id).subscribe({
        next: () => this.loadCartItems(),
        error: () => this.errorHandler.showError('Failed to remove item')
      });
    } else {
      this.cartService.updateQuantity(existing.id, existing.quantity - 1).subscribe({
        next: () => this.loadCartItems(),
        error: () => this.errorHandler.showError('Failed to update cart')
      });
    }
  }

  getItemQuantity(id: number): number {
    const item = this.cartItems.find(ci => ci.menu_item?.id === id);
    return item ? item.quantity : 0;
  }

  goToCart() { this.router.navigate(['/cart']); }

  saveAddress() {
    if (this.address.trim()) {
      localStorage.setItem('address', this.address);
      this.isEditingAddress = false;
      this.errorHandler.showSuccess('Address saved');
    }
  }

  editAddress()  { this.isEditingAddress = true; }

  cancelEdit() {
    this.isEditingAddress = false;
    const saved = localStorage.getItem('address');
    if (saved) this.address = saved;
  }

  scrollToCategory(categoryId: string) {
    this.activeCategory = categoryId;
    const el = document.getElementById(categoryId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}