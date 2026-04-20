import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  orders: any[] = [];
  isLoading = false;
  isLoadingOrders = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadOrders();
  }

  loadProfile() {
    this.isLoading = true;
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorHandler.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  loadOrders() {
    this.isLoadingOrders = true;
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoadingOrders = false;
      },
      error: () => {
        this.orders = [];
        this.isLoadingOrders = false;
      }
    });
  }

  getUserInitials(): string {
    if (!this.user) return 'U';
    const name = this.user.full_name || this.user.username || 'User';
    return name.substring(0, 2).toUpperCase();
  }

  getTotalSpent(): number {
    return this.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }

  getFavoriteRestaurant(): string {
    if (this.orders.length === 0) return '🍕';
    const restaurantCount: {[key: string]: number} = {};
    this.orders.forEach(order => {
      const name = order.restaurantName || 'DeliverEats';
      restaurantCount[name] = (restaurantCount[name] || 0) + 1;
    });
    const favorite = Object.keys(restaurantCount).reduce((a, b) => 
      restaurantCount[a] > restaurantCount[b] ? a : b, '');
    return favorite;
  }

  editProfile() {
    this.router.navigate(['/profile/edit']);
  }

  viewAllOrders() {
    this.router.navigate(['/orders']);
  }

  viewOrderDetails(order: any) {
    this.router.navigate(['/orders', order.id]);
  }

  goToAddresses() {
    this.router.navigate(['/addresses']);
  }

  goToPayment() {
    this.router.navigate(['/payment-methods']);
  }

  goToSecurity() {
    this.router.navigate(['/change-password']);
  }

  logout() {
    this.authService.logout();
    this.errorHandler.showSuccess('Logged out successfully');
    this.router.navigate(['/login']);
  }
}