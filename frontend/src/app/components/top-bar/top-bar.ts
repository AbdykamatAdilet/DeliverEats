import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './top-bar.html',
  styleUrls: ['./top-bar.css']
})
export class TopBarComponent implements OnInit {
  cartCount = 0;
  username = '';
  isMenuOpen = false;

  navItems = [
    { path: '/menu',      label: 'Menu',      icon: '🍕' },
    { path: '/cart',      label: 'Cart',      icon: '🛒' },
    { path: '/checkout',  label: 'Checkout',  icon: '✅' },
    { path: '/addresses', label: 'Addresses', icon: '📍' },
    { path: '/orders',    label: 'Orders',    icon: '📦' },
    { path: '/profile',   label: 'Profile',   icon: '👤' },
  ];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loadUserProfile();
      this.loadCartCount();
    }
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (user: any) => { this.username = user?.username || 'User'; },
      error: () => { this.username = ''; }
    });
  }


  loadCartCount() {
    this.cartService.getCartItems().subscribe({
      next: (data: any) => {
        const items: any[] = data?.items ?? (Array.isArray(data) ? data : []);
        this.cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      },
      error: () => { this.cartCount = 0; }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.errorHandler.showSuccess('Logged out successfully');
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}