import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService} from '../../services/cart.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
    selector: 'app-top-bar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './top-bar.html',
    styleUrls: ['./top-bar.css']
})
export class TopBarComponent implements OnInit {
    cartItemCount: number = 0;
    username: string = '';
    isMenuOpen: boolean = false;

    navItems = [
        { path: '/menu', label: 'Menu', icon: '🍕' },
        { path: '/cart', label: 'Cart', icon: '🛒' },
        { path: '/checkout', label: 'Checkout', icon: '✅' },  // ADDED CHECKOUT
        { path: '/addresses', label: 'Addresses', icon: '📍' },
        { path: '/orders', label: 'Orders', icon: '📦' },
        { path: '/profile', label: 'Profile', icon: '👤' }
    ];

    constructor(
        private authService: AuthService,
        private CartService: CartService,
        private errorHandler: ErrorHandlerService,
        private router: Router
    ) {}
    cartCount = 0;

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
        this.CartService.getCartItems().subscribe({
            next: (data: any) => {
                this.cartCount = data.items?.length || data?.length || 0;
            },
            error: () => {
                this.cartCount = 0;
            }
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
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        document.body.style.overflow = '';
    }
}