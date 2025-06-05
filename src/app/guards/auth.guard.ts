import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const isAuthenticated = await firstValueFrom(this.authService.initAuthCheck());

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as string[];

    if (expectedRoles && expectedRoles.length > 0) {
      const role = await firstValueFrom(this.authService.getRole());
      if (!role || !expectedRoles.includes(role)) {
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}
