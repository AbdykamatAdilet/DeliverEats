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
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
    cartItemCount: number = 0;
    username: string = '';
    isMenuOpen: boolean = false;

    navItems = [
        { path: '/menu', label: 'Menu', icon: '🍕' },
        { path: '/cart', label: 'Cart', icon: '🛒' },
        { path: '/addresses', label: 'Addresses', icon: '📍' },
        { path: '/orders', label: 'Orders', icon: '📦' },
        { path: '/profile', label: 'Profile', icon: '👤' }
    ];

    constructor(
        private authService: AuthService,
        private cartService: CartService,
        private toastService: ErrorHandlerService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadUserProfile();
        this.loadCartCount();
    }

    loadUserProfile() {
        this.authService.getProfile().subscribe({
            next: (user: any) => {
                this.username = user?.username || 'User';
            },
            error: () => {
                this.username = '';
            }
        });
    }

    loadCartCount() {
        this.cartService.getCartItems().subscribe({
            next: (items: any[]) => {
                this.cartItemCount = items?.length || 0;
            },
            error: () => {
                this.cartItemCount = 0;
            }
        });
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    logout() {
        this.authService.logout();
        this.toastService.showSuccess('Logged out successfully');
        this.router.navigate(['/login']);
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        this.isMenuOpen = false;
    }
}