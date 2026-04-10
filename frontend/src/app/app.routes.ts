import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Сюда добавишь пути для напарников, например:
  // { path: 'catalog', component: CatalogComponent },
  // { path: 'profile', component: ProfileComponent },
];