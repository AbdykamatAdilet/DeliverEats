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
      error: () => {
        this.errorHandler.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  loadOrders() {
    this.isLoadingOrders = true;
    this.orderService.getUserOrders().subscribe({
      next: (data) => { this.orders = data; this.isLoadingOrders = false; },
      error: () => { this.orders = []; this.isLoadingOrders = false; }
    });
  }

  getUserInitials(): string {
    if (!this.user) return 'U';
    const name = this.user.full_name || this.user.username || 'User';
    return name.substring(0, 2).toUpperCase();
  }

  getTotalSpent(): number {
    return this.orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
  }

  getFavoriteRestaurant(): string {
    return this.orders.length > 0 ? 'DeliverEats' : '🍕';
  }

  viewAllOrders() { this.router.navigate(['/orders']); }
  editProfile() { this.errorHandler.showError('Profile editing coming soon!'); }

  goToAddresses() { this.router.navigate(['/addresses']); }
  goToPayment()   { this.errorHandler.showError('Payment methods coming soon!'); }
  goToSecurity()  { this.errorHandler.showError('Security settings coming soon!'); }

  logout() {
    this.authService.logout();
    this.errorHandler.showSuccess('Logged out successfully');
    this.router.navigate(['/login']);
  }

  viewOrderDetails(order: any) {
    this.router.navigate(['/orders']);
  }
}