import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import UserRoles from '../../enums/userRoles';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  role: string | null;

  constructor(private authService: AuthService) {
    this.role = this.authService.getRole();
  }
}
