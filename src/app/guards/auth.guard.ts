import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const expectedRoles = route.data['roles'] as string[]
    const role = await this.authService.getRole();

    if (expectedRoles && (!role || !expectedRoles.includes(role))) {
      this.router.navigate(['/']);
      return false;
    }
    
    return true;
  }
}
