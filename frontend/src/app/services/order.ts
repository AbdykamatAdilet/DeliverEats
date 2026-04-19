import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/`);
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${orderId}/`);
  }
}