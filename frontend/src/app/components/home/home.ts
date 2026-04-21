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
  isLoadingCart = true;

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
    { id: 1,  name: 'Omelette',          price: 1200, category: 'breakfast' },
    { id: 2,  name: 'Pancakes',          price: 850,  category: 'breakfast' },
    { id: 3,  name: 'Cottage Cheese',    price: 1150, category: 'breakfast' },
    { id: 4,  name: 'Rice Porridge',     price: 900,  category: 'breakfast' },
    { id: 5,  name: 'Oatmeal',           price: 1000, category: 'breakfast' },
    { id: 6,  name: 'Fried Eggs',        price: 900,  category: 'breakfast' },

    { id: 7,  name: 'Steak',             price: 3500, category: 'hot' },
    { id: 8,  name: 'Chicken Steak',     price: 2800, category: 'hot' },
    { id: 9,  name: 'Pasta',             price: 3200, category: 'hot' },
    { id: 10, name: 'Lagman',            price: 2200, category: 'hot' },
    { id: 11, name: 'Plov',              price: 2500, category: 'hot' },
    { id: 12, name: 'Beshbarmak',        price: 3800, category: 'hot' },

    { id: 13, name: 'Borsch',            price: 1500, category: 'soup' },
    { id: 14, name: 'Chicken Soup',      price: 1300, category: 'soup' },
    { id: 15, name: 'Tomato Soup',       price: 1200, category: 'soup' },
    { id: 16, name: 'Mushroom Cream Soup', price: 1400, category: 'soup' },
    { id: 17, name: 'Lentil Soup',       price: 1100, category: 'soup' },
    { id: 18, name: 'Shurpa',            price: 1600, category: 'soup' },

    { id: 19, name: 'Caesar Salad',      price: 1800, category: 'salads' },
    { id: 20, name: 'Greek Salad',       price: 1600, category: 'salads' },
    { id: 21, name: 'Olivier Salad',     price: 1400, category: 'salads' },
    { id: 22, name: 'Tuna Salad',        price: 1700, category: 'salads' },
    { id: 23, name: 'Caprese Salad',     price: 1900, category: 'salads' },
    { id: 24, name: 'Vinaigrette',       price: 1100, category: 'salads' },

    { id: 25, name: 'Mashed Potatoes',   price: 700,  category: 'sideDish' },
    { id: 26, name: 'French Fries',      price: 800,  category: 'sideDish' },
    { id: 27, name: 'Steamed Rice',      price: 600,  category: 'sideDish' },
    { id: 28, name: 'Grilled Vegetables',price: 900,  category: 'sideDish' },
    { id: 29, name: 'Buckwheat',         price: 650,  category: 'sideDish' },
    { id: 30, name: 'Macaroni',          price: 700,  category: 'sideDish' },

    { id: 31, name: 'Cheesecake',        price: 1200, category: 'dessert' },
    { id: 32, name: 'Ice Cream',         price: 900,  category: 'dessert' },
    { id: 33, name: 'Tiramisu',          price: 1400, category: 'dessert' },
    { id: 34, name: 'Chocolate Brownie', price: 1100, category: 'dessert' },
    { id: 35, name: 'Fruit Tart',        price: 1300, category: 'dessert' },
    { id: 36, name: 'Baklava',           price: 1000, category: 'dessert' },

    { id: 37, name: 'Green Tea',         price: 500,  category: 'drinks' },
    { id: 38, name: 'Fresh Juice',       price: 900,  category: 'drinks' },
    { id: 39, name: 'Lemonade',          price: 800,  category: 'drinks' },
    { id: 40, name: 'Cappuccino',        price: 1100, category: 'drinks' },
    { id: 41, name: 'Smoothie',          price: 1200, category: 'drinks' },
    { id: 42, name: 'Ayran',             price: 600,  category: 'drinks' },
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
    this.isLoadingCart = true;
    this.cartService.getCartItems().subscribe({
      next: (response: any) => {
        const items: any[] = response?.items ?? (Array.isArray(response) ? response : []);
        this.cartItems = items;
        this.cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        this.isLoadingCart = false;
      },
      error: () => {
        this.cartCount = 0;
        this.cartItems = [];
        this.isLoadingCart = false;
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
      existing.quantity += 1;
      this.cartCount += 1;
      this.cartService.updateQuantity(existing.id, existing.quantity).subscribe({
        error: () => { existing.quantity -= 1; this.cartCount -= 1; }
      });
    } else {
      const tempItem = { id: -1, menu_item: { id: item.id, name: item.name, price: item.price }, quantity: 1 };
      this.cartItems.push(tempItem);
      this.cartCount += 1;
      this.cartService.addToCart(item.id, 1).subscribe({
        next: () => this.loadCartItems(), 
        error: () => {
          this.cartItems = this.cartItems.filter(ci => ci !== tempItem);
          this.cartCount -= 1;
          this.errorHandler.showError('Failed to add to cart');
        }
      });
    }
  }

  decrease(item: any) {
    const existing = this.cartItems.find(ci => ci.menu_item?.id === item.id);
    if (!existing) return;

    if (existing.quantity <= 1) {
      this.cartItems = this.cartItems.filter(ci => ci !== existing);
      this.cartCount -= 1;
      this.cartService.removeItem(existing.id).subscribe({
        error: () => { this.cartItems.push(existing); this.cartCount += 1; }
      });
    } else {
      existing.quantity -= 1; 
      this.cartCount -= 1;
      this.cartService.updateQuantity(existing.id, existing.quantity).subscribe({
        error: () => { existing.quantity += 1; this.cartCount += 1; }
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