import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'DeliverEats';

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }
}