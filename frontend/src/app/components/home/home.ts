import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home{
  searchText = '';
  categories = [
    { id: 'breakfast', name: 'Завтраки' },
    { id: 'hot', name: 'Горячие блюда' },
    { id: 'soup', name: 'Супы' },
    { id: 'salads', name: 'Салаты' },
    { id: 'sideDish', name: 'Гарниры' },
    { id: 'dessert', name: 'Десерты' },
    { id: 'drinks', name: 'Напитки' }
  ];
  
  menuItems = [
    { name: 'Омлет', price: 1200, category: 'breakfast' },
    { name: 'Блины', price: 850, category: 'breakfast' },
    { name: 'Творог', price: 1150, category: 'breakfast' },
    { name: 'Каша рисовая', price: 900, category: 'breakfast' },
    { name: 'Каша овсяная', price: 1000, category: 'breakfast' },
    { name: 'Яйчница', price: 900, category: 'breakfast' },
  
    { name: 'Стейк', price: 3500, category: 'hot' },
    { name: 'Стейк куриный', price: 2800, category: 'hot' },
    { name: 'Паста', price: 3200, category: 'hot' },
    { name: 'Лагман', price: 2200, category: 'hot' },
    { name: 'Манты', price: 2000, category: 'hot' },
    { name: 'Бифштекс с яйцом', price: 1750, category: 'hot' },
    { name: 'Курица в белом соусе', price: 2250, category: 'hot' },
    { name: 'Гуляш из говядины', price: 2150, category: 'hot' },
    { name: 'Жареная рыба', price: 2400, category: 'hot' },

    { name: 'Борщ с капусткой но не красный', price: 1000, category: 'soup' },
    { name: 'Рассольник', price: 800, category: 'soup' },
    { name: 'Солянка', price: 1200, category: 'soup' },
    { name: 'Гороховый суп', price: 900, category: 'soup' },
    { name: 'Кеспе', price: 800, category: 'soup' },
    { name: 'Шурпа из баранины', price: 1500, category: 'soup' },
  
    { name: 'Цезарь', price: 1250, category: 'salads' },
    { name: 'Греческий', price: 1250, category: 'salads' },
    { name: 'Винегрет', price: 1000, category: 'salads' },
    { name: 'Свежие овощи', price: 900, category: 'salads' },
    { name: 'Малибу', price: 1250, category: 'salads' },
    { name: 'Салат Оливье', price: 1000, category: 'salads' },   
    { name: 'Салат с рукколой', price: 950, category: 'salads' },
    { name: 'Сельд из под шубы', price: 1000, category: 'salads' },

    { name: 'Картофельное пюре', price: 850, category: 'sideDish' },
    { name: 'Рис', price: 700, category: 'sideDish' },
    { name: 'Гречка', price: 800, category: 'sideDish' },
    { name: 'Макароны', price: 850, category: 'sideDish' },
    { name: 'Картофель фри', price: 1000, category: 'sideDish' },  

    { name: 'Чизкейк', price: 1500, category: 'dessert' },
    { name: 'Пирог сметанный', price: 1250, category: 'dessert' },
    { name: 'Торт медовый', price: 1500, category: 'dessert' },
    { name: 'Вупи пай', price: 1750, category: 'dessert' },
    { name: 'Напалеон', price: 1350, category: 'dessert' },  
    { name: 'Пончик', price: 1000, category: 'dessert' },  

    { name: 'Coca Cola 1L', price: 1000, category: 'drinks' }, 
    { name: 'Sprite 1L', price: 900, category: 'drinks' },  
    { name: 'Fuse 0.5L', price: 600, category: 'drinks' },  
    { name: 'Сок Piko 1L', price: 1250, category: 'drinks' },  
    { name: 'Вода 0.5L', price: 500, category: 'drinks' },  
    { name: 'Компот 1L', price: 950, category: 'drinks' },  
  ];
  
  cart: any[] = [];
  activeCategory = '';

setActive(catId: string) {
  this.activeCategory = catId;
  this.scrollToCategory(catId);
}

  get filteredItems() {
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
  }
  address: string = '';
isEditingAddress: boolean = false;

ngOnInit() {
  const savedAddress = localStorage.getItem('address');
  if (savedAddress) {
    this.address = savedAddress;
  }
}

saveAddress() {
  if (this.address.trim()) {
    localStorage.setItem('address', this.address);
    this.isEditingAddress = false;
  }
}

editAddress() {
  this.isEditingAddress = true;
}
  get totalPrice() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  scrollToCategory(categoryId: string) {
    const el = document.getElementById(categoryId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  remove(item: any) {
    this.cart = this.cart.filter(i => i !== item);
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
    alert('Заказ оформлен на сумму ' + this.totalPrice + ' ₸');
    this.cart = [];
  }
}
