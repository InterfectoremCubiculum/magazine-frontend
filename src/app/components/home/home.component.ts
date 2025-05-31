import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import userRoles from '../../enums/userRoles';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  role: userRoles | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.role = await firstValueFrom(this.authService.getRole());
  }
}


