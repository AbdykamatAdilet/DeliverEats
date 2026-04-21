import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  selectedStatus = 'all';

  statusTabs = [
    { value: 'all',        label: 'All Orders' },
    { value: 'pending',    label: 'Pending' },
    { value: 'preparing',  label: 'Preparing' },
    { value: 'delivering', label: 'Delivering' },
    { value: 'delivered',  label: 'Delivered' },
    { value: 'cancelled',  label: 'Cancelled' },
  ];

  constructor(
    private orderService: OrderService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getUserOrders().subscribe({
      next:  (data) => { this.orders = data; this.isLoading = false; },
      error: ()     => { this.orders = []; this.isLoading = false; }
    });
  }

  get filteredOrders(): Order[] {
    return this.selectedStatus === 'all'
      ? this.orders
      : this.orders.filter(o => o.status === this.selectedStatus);
  }

  changeStatus(s: string) { this.selectedStatus = s; }

  getStatusBadgeClass(status: string): string {
    const map: Record<string,string> = {
      delivered:  'status-delivered',
      pending:    'status-pending',
      preparing:  'status-preparing',
      delivering: 'status-delivering',
      cancelled:  'status-cancelled',
      confirmed:  'status-confirmed',
    };
    return map[status] || 'status-default';
  }

  getStatusIcon(status: string): string {
    const map: Record<string,string> = {
      delivered: '✅', pending: '⏳', preparing: '👨‍🍳',
      delivering: '🚴', cancelled: '❌', confirmed: '✓',
    };
    return map[status] || '📦';
  }

  cancelOrder(orderId: number) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    this.orderService.cancelOrder(orderId).subscribe({
      next:  () => { this.errorHandler.showSuccess('Order cancelled'); this.loadOrders(); },
      error: () =>   this.errorHandler.showError('Cannot cancel this order')
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}