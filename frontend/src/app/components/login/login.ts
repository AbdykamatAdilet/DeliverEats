import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Нужно для ngModel
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Успех!', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Неверный логин или пароль';
      }
    });
  }
}