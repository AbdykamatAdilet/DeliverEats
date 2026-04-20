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
  
  categories = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'hot', name: 'Hot Dishes' },
    { id: 'soup', name: 'Soups' },
    { id: 'salads', name: 'Salads' },
    { id: 'sideDish', name: 'Side Dishes' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' }
  ];
  
  menuItems = [
    { id: 1, name: 'Omelette', price: 1200, category: 'breakfast' },
    { id: 2, name: 'Pancakes', price: 850, category: 'breakfast' },
    { id: 3, name: 'Cottage Cheese', price: 1150, category: 'breakfast' },
    { id: 4, name: 'Rice Porridge', price: 900, category: 'breakfast' },
    { id: 5, name: 'Oatmeal', price: 1000, category: 'breakfast' },
    { id: 6, name: 'Fried Eggs', price: 900, category: 'breakfast' },
    { id: 7, name: 'Steak', price: 3500, category: 'hot' },
    { id: 8, name: 'Chicken Steak', price: 2800, category: 'hot' },
    { id: 9, name: 'Pasta', price: 3200, category: 'hot' },
    { id: 10, name: 'Lagman', price: 2200, category: 'hot' },
    { id: 11, name: 'Manti', price: 2000, category: 'hot' },
    { id: 12, name: 'Beefsteak with Egg', price: 1750, category: 'hot' },
    { id: 13, name: 'Chicken in White Sauce', price: 2250, category: 'hot' },
    { id: 14, name: 'Beef Goulash', price: 2150, category: 'hot' },
    { id: 15, name: 'Fried Fish', price: 2400, category: 'hot' },
    { id: 16, name: 'Borscht', price: 1000, category: 'soup' },
    { id: 17, name: 'Rassolnik', price: 800, category: 'soup' },
    { id: 18, name: 'Solyanka', price: 1200, category: 'soup' },
    { id: 19, name: 'Pea Soup', price: 900, category: 'soup' },
    { id: 20, name: 'Kespe', price: 800, category: 'soup' },
    { id: 21, name: 'Lamb Shurpa', price: 1500, category: 'soup' },
    { id: 22, name: 'Caesar', price: 1250, category: 'salads' },
    { id: 23, name: 'Greek', price: 1250, category: 'salads' },
    { id: 24, name: 'Vinaigrette', price: 1000, category: 'salads' },
    { id: 25, name: 'Fresh Vegetables', price: 900, category: 'salads' },
    { id: 26, name: 'Malibu', price: 1250, category: 'salads' },
    { id: 27, name: 'Olivier Salad', price: 1000, category: 'salads' },   
    { id: 28, name: 'Rocket Salad', price: 950, category: 'salads' },
    { id: 29, name: 'Herring under Fur Coat', price: 1000, category: 'salads' },
    { id: 30, name: 'Mashed Potatoes', price: 850, category: 'sideDish' },
    { id: 31, name: 'Rice', price: 700, category: 'sideDish' },
    { id: 32, name: 'Buckwheat', price: 800, category: 'sideDish' },
    { id: 33, name: 'Pasta', price: 850, category: 'sideDish' },
    { id: 34, name: 'French Fries', price: 1000, category: 'sideDish' },  
    { id: 35, name: 'Cheesecake', price: 1500, category: 'dessert' },
    { id: 36, name: 'Sour Cream Pie', price: 1250, category: 'dessert' },
    { id: 37, name: 'Honey Cake', price: 1500, category: 'dessert' },
    { id: 38, name: 'Whoopie Pie', price: 1750, category: 'dessert' },
    { id: 39, name: 'Napoleon', price: 1350, category: 'dessert' },  
    { id: 40, name: 'Donut', price: 1000, category: 'dessert' },  
    { id: 41, name: 'Coca Cola 1L', price: 1000, category: 'drinks' }, 
    { id: 42, name: 'Sprite 1L', price: 900, category: 'drinks' },  
    { id: 43, name: 'Fuse 0.5L', price: 600, category: 'drinks' },  
    { id: 44, name: 'Piko Juice 1L', price: 1250, category: 'drinks' },  
    { id: 45, name: 'Water 0.5L', price: 500, category: 'drinks' },  
    { id: 46, name: 'Compote 1L', price: 950, category: 'drinks' }
  ];
  
  address: string = '';
  isEditingAddress: boolean = false;

  constructor(
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const savedAddress = localStorage.getItem('address');
    if (savedAddress) {
      this.address = savedAddress;
    }
    this.loadCartCount();
  }

  loadCartCount() {
    this.cartService.getCartItems().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.cartCount = response.length;
        } else if (response && response.items) {
          this.cartCount = response.items.length;
        } else {
          this.cartCount = 0;
        }
      },
      error: () => {
        this.cartCount = 0;
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
    this.cartService.addToCart(item.id, 1).subscribe({
      next: () => {
        this.errorHandler.showSuccess(`${item.name} added to cart!`);
        this.loadCartCount();
      },
      error: (err) => {
        let errorMsg = 'Failed to add to cart';
        if (err.status === 401) {
          errorMsg = 'Please login first';
          this.router.navigate(['/login']);
        } else if (err.status === 0) {
          errorMsg = 'Cannot connect to server';
        }
        this.errorHandler.showError(errorMsg);
      }
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  saveAddress() {
    if (this.address.trim()) {
      localStorage.setItem('address', this.address);
      this.isEditingAddress = false;
      this.errorHandler.showSuccess('Address saved');
    }
  }

  editAddress() {
    this.isEditingAddress = true;
  }

  cancelEdit() {
    this.isEditingAddress = false;
    const savedAddress = localStorage.getItem('address');
    if (savedAddress) {
      this.address = savedAddress;
    }
  }

  scrollToCategory(categoryId: string) {
    this.activeCategory = categoryId;
    const el = document.getElementById(categoryId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}