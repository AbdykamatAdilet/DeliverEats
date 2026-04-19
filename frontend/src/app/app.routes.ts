import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { CartComponent } from './components/cart/cart';
import { ProfileComponent } from './components/profile/profile';
import { AddressListComponent } from './components/address-list/address-list';
import { AddressFormComponent } from './components/address-form/address-form';
import { CheckoutComponent }    from './components/checkout/checkout';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'addresses', component: AddressListComponent },
  { path: 'addresses/new', component: AddressFormComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Сюда добавишь пути для напарников, например:
  { path: '', component: Home }  // Сюда добавишь пути для напарников, например:
  // { path: 'catalog', component: CatalogComponent },
  // { path: 'profile', component: ProfileComponent },
];