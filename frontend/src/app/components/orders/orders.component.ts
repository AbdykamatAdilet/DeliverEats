import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    selectedStatus: string = 'all';

    statusTabs = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'delivering', label: 'Delivering' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    constructor(
        private orderService: OrderService,
        private errorHandler: ErrorHandlerService
    ) {}

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.isLoading = true;
        this.orderService.getUserOrders().subscribe({
            next: (data) => {
                this.orders = data;
                this.isLoading = false;
            },
            error: () => {
                this.orders = [];
                this.isLoading = false;
            }
        });
    }

    get filteredOrders(): Order[] {
        if (this.selectedStatus === 'all') {
            return this.orders;
        }
        return this.orders.filter(order => order.status === this.selectedStatus);
    }

    changeStatus(status: string) {
        this.selectedStatus = status;
    }

    getStatusBadgeClass(status: string): string {
        switch(status) {
            case 'delivered': return 'status-delivered';
            case 'pending': return 'status-pending';
            case 'preparing': return 'status-preparing';
            case 'delivering': return 'status-delivering';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    }

    getStatusIcon(status: string): string {
        switch(status) {
            case 'delivered': return 'delivered';
            case 'pending': return 'pending';
            case 'preparing': return 'preparing';
            case 'delivering': return 'delivering';
            case 'cancelled': return 'cancelled';
            default: return 'default';
        }
    }

    cancelOrder(orderId: number) {
        if (confirm('Are you sure you want to cancel this order?')) {
            this.orderService.cancelOrder(orderId).subscribe({
                next: () => {
                    this.errorHandler.showSuccess('Order cancelled successfully');
                    this.loadOrders();
                },
                error: () => {
                    this.errorHandler.showError('Failed to cancel order');
                }
            });
        }
    }

    reorder(orderId: number) {
        this.orderService.reorder(orderId).subscribe({
            next: () => {
                this.errorHandler.showSuccess('Items added to cart!');
            },
            error: () => {
                this.errorHandler.showError('Failed to reorder');
            }
        });
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}