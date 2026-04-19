import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/`);
  }

  addToCart(menuItemId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/`, { menu_item: menuItemId, quantity: quantity });
  }

  removeItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${id}/`); 
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/clear/`);
  }

  processCheckout(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout/`, orderData);
  }
}