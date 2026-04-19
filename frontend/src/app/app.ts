import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ErrorHandlerService } from './services/error-handler.service'; 
import { TopBarComponent } from './components/top-bar/top-bar';
import { ErrorMessageComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, ErrorMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'DeliverEats';

  constructor(private authService: AuthService, private router: Router) {}

}