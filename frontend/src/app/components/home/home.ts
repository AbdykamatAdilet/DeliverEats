import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';

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
   
    { name: 'Omelette', price: 1200, category: 'breakfast' },
    { name: 'Pancakes', price: 850, category: 'breakfast' },
    { name: 'Cottage Cheese', price: 1150, category: 'breakfast' },
    { name: 'Rice Porridge', price: 900, category: 'breakfast' },
    { name: 'Oatmeal', price: 1000, category: 'breakfast' },
    { name: 'Fried Eggs', price: 900, category: 'breakfast' },

    { name: 'Steak', price: 3500, category: 'hot' },
    { name: 'Chicken Steak', price: 2800, category: 'hot' },
    { name: 'Pasta', price: 3200, category: 'hot' },
    { name: 'Lagman', price: 2200, category: 'hot' },
    { name: 'Manti', price: 2000, category: 'hot' },
    { name: 'Beefsteak with Egg', price: 1750, category: 'hot' },
    { name: 'Chicken in White Sauce', price: 2250, category: 'hot' },
    { name: 'Beef Goulash', price: 2150, category: 'hot' },
    { name: 'Fried Fish', price: 2400, category: 'hot' },
  
    { name: 'Borscht', price: 1000, category: 'soup' },
    { name: 'Rassolnik', price: 800, category: 'soup' },
    { name: 'Solyanka', price: 1200, category: 'soup' },
    { name: 'Pea Soup', price: 900, category: 'soup' },
    { name: 'Kespe', price: 800, category: 'soup' },
    { name: 'Lamb Shurpa', price: 1500, category: 'soup' },
  
    { name: 'Caesar', price: 1250, category: 'salads' },
    { name: 'Greek', price: 1250, category: 'salads' },
    { name: 'Vinaigrette', price: 1000, category: 'salads' },
    { name: 'Fresh Vegetables', price: 900, category: 'salads' },
    { name: 'Malibu', price: 1250, category: 'salads' },
    { name: 'Olivier Salad', price: 1000, category: 'salads' },   
    { name: 'Rocket Salad', price: 950, category: 'salads' },
    { name: 'Herring under Fur Coat', price: 1000, category: 'salads' },

    { name: 'Mashed Potatoes', price: 850, category: 'sideDish' },
    { name: 'Rice', price: 700, category: 'sideDish' },
    { name: 'Buckwheat', price: 800, category: 'sideDish' },
    { name: 'Pasta', price: 850, category: 'sideDish' },
    { name: 'French Fries', price: 1000, category: 'sideDish' },  
    { name: 'Cheesecake', price: 1500, category: 'dessert' },
    { name: 'Sour Cream Pie', price: 1250, category: 'dessert' },
    { name: 'Honey Cake', price: 1500, category: 'dessert' },
    { name: 'Whoopie Pie', price: 1750, category: 'dessert' },
    { name: 'Napoleon', price: 1350, category: 'dessert' },  
    { name: 'Donut', price: 1000, category: 'dessert' },  
    { name: 'Coca Cola 1L', price: 1000, category: 'drinks' }, 
    { name: 'Sprite 1L', price: 900, category: 'drinks' },  
    { name: 'Fuse 0.5L', price: 600, category: 'drinks' },  
    { name: 'Piko Juice 1L', price: 1250, category: 'drinks' },  
    { name: 'Water 0.5L', price: 500, category: 'drinks' },  
    { name: 'Compote 1L', price: 950, category: 'drinks' }
  ];
  
  cart: any[] = [];
  address: string = '';
  isEditingAddress: boolean = false;

  constructor(
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    const savedAddress = localStorage.getItem('address');
    if (savedAddress) {
      this.address = savedAddress;
    }
  }

  get filteredItems() {
    if (!this.searchText) return this.menuItems;
    return this.menuItems.filter(item =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  addToCart(item: any) {
    const existingItem = this.cart.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.errorHandler.showSuccess(`${item.name} added to cart`);
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
  }

  get totalPrice() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  scrollToCategory(categoryId: string) {
    this.activeCategory = categoryId;
    const el = document.getElementById(categoryId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  remove(item: any) {
    this.cart = this.cart.filter(i => i !== item);
    this.errorHandler.showSuccess('Item removed from cart');
  }

  increase(item: any) {
    item.quantity++;
  }

  decrease(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.remove(item);
    }
  }

  checkout() {
    if (this.cart.length === 0) {
      this.errorHandler.showError('Your cart is empty');
      return;
    }
    if (!this.address) {
      this.errorHandler.showError('Please enter delivery address');
      this.isEditingAddress = true;
      return;
    }
    this.router.navigate(['/checkout']);
  }
}