import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.errorHandler.showError('Please enter username and password');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Logging in with:', this.username);
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.errorHandler.showSuccess(`Welcome, ${this.username}!`);
        this.router.navigate(['/menu']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.message || 'Invalid username or password';
        this.errorHandler.showError(this.errorMessage);
        this.isLoading = false;
      }
    });
  }
}