import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Use your Django server URL
  private apiUrl = 'http://127.0.0.1:8000/api/cart/';

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToCart(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  removeItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}clear/`);
  }

  processCheckout(orderData: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/checkout/', orderData);
  }
}