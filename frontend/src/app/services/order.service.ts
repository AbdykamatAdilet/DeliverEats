import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

export interface Order {
    id: number;
    orderNumber: string;
    restaurantName: string;
    restaurantImage?: string;
    date: string;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
    payment_method: string;
    delivery_street: string;
    delivery_building: string;
    special_instructions?: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    menu_item: number;
    name: string;
    quantity: number;
    price_at_time: number;
    subtotal: number;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://127.0.0.1:8000/api';

    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService
    ) {}

    getUserOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/`).pipe(
            catchError((error) => {
                this.errorHandler.showError('Failed to load orders');
                throw error;
            })
        );
    }

    getOrderDetails(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}/`).pipe(
            catchError((error) => {
                this.errorHandler.showError('Failed to load order details');
                throw error;
            })
        );
    }

    cancelOrder(orderId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/orders/${orderId}/cancel/`, {}).pipe(
            catchError((error) => {
                this.errorHandler.showError('Failed to cancel order');
                throw error;
            })
        );
    }

    reorder(orderId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/orders/${orderId}/reorder/`, {}).pipe(
            catchError((error) => {
                this.errorHandler.showError('Failed to reorder');
                throw error;
            })
        );
    }
}