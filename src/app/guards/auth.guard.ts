import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router ) {}

  ngOnInit(): void {
    this.authService.initAuthCheck();
  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const expectedRoles = route.data['roles'] as string[];

    const role = await firstValueFrom(this.authService.getRole());
    if (expectedRoles && (!role || !expectedRoles.includes(role))) {
      this.router.navigate(['/']);
      return false;
    }
    
    return true;
  }
}
