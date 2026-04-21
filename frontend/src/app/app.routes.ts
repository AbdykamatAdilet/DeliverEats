import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { CartComponent } from './components/cart/cart';
import { ProfileComponent } from './components/profile/profile';
import { AddressListComponent } from './components/address-list/address-list';
import { AddressFormComponent } from './components/address-form/address-form';
import { CheckoutComponent } from './components/checkout/checkout';
import { Home } from './components/home/home';
import { OrdersComponent } from './components/orders/orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'addresses', component: AddressListComponent },
  { path: 'addresses/new', component: AddressFormComponent },
  { path: 'addresses/:id', component: AddressFormComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent },
  { path: '**', redirectTo: '/menu' }
];