import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    console.log('Attempting login to:', `${this.apiUrl}/login/`);
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        
        if (response && (response.access || response.token)) {
          const token = response.access || response.token;
          localStorage.setItem('access_token', token);
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
          console.log('Token saved successfully');
        } else {
          console.warn('No token in response');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error details:', error);
        let errorMessage = 'Login failed';
        
        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Is Django running?';
        } else if (error.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error.status === 404) {
          errorMessage = 'Login endpoint not found. Check backend URLs';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/`).pipe(
      catchError((error) => {
        console.error('Profile fetch error:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }
}