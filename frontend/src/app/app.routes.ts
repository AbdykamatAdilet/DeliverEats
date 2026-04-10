import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { CartComponent } from './components/cart/cart';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Сюда добавишь пути для напарников, например:
  // { path: 'catalog', component: CatalogComponent },
  // { path: 'profile', component: ProfileComponent },
];