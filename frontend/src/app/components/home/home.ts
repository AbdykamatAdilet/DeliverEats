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

    { name: 'Coca Cola 1l', price: 1000, category: 'drinks' }, 
    { name: 'Sprite 1l', price: 900, category: 'drinks' },  
    { name: 'Fuse 0.5l', price: 600, category: 'drinks' },  
    { name: 'Сок Piko 1l', price: 1250, category: 'drinks' },  
    { name: 'Вода 0.5l', price: 500, category: 'drinks' },  
    { name: 'Компот 1l', price: 950, category: 'drinks' },  
  ];
  cart: any[] = [];
  activeCategory = '';

setActive(catId: string) {
  this.activeCategory = catId;
  this.scrollToCategory(catId);
}
  //фильтр поиска
  get filteredItems() {
    return this.menuItems.filter(item =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // 🛒 Добавление в корзину
  addToCart(item: any) {
    this.cart.push(item);
  }

  // 💰 Общая сумма
  get totalPrice() {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  }

  // 🚀 Скролл к категории
  scrollToCategory(categoryId: string) {
    const el = document.getElementById(categoryId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // 📦 Оформление заказа
  checkout() {
    alert('Заказ оформлен на сумму ' + this.totalPrice + ' ₸');
    this.cart = [];
  }
}