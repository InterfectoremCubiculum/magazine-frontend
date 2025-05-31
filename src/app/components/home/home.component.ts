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
  role: string | null = null;

  constructor(private authService: AuthService) {

  }
  async ngOnInit() {
    const role = await this.authService.getRole();
    this.role = role;
  }
}
