import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[]
    const user = this.authService.getCurrentUser();

    if (expectedRoles && (!user?.role || !expectedRoles.includes(user.role))) {
      this.router.navigate(['/']);
      return false;
    }
    
    return true;
  }
}
