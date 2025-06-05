import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError, tap, take, lastValueFrom, firstValueFrom, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthResponse } from '../interfaces/AuthResponse';
import { User } from '../interfaces/User';
import { LoginDto } from '../dtos/auth/login.dto';
import { RegisterDto } from '../dtos/auth/register.dto';
import userRoles from '../enums/userRoles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private authUrl = `${environment.apiBaseUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'auth-token';

  login(loginData: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, loginData).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
      catchError(error => {
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(registerData: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, registerData).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
      catchError(error => {
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError(() => {
        this.clearAuthData();
        return throwError(() => new Error('Logout completed locally'));
      })
    );
  }

  validateToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    return this.http.get(`${this.authUrl}/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        this.clearAuthData();
        return throwError(() => new Error('Token validation failed'));
      })
    );
  }
  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.token);

    const user: User = {
      id: authResponse.userId,
      username: authResponse.username,
      email: '',
      role: authResponse.role as userRoles
    };
    
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  initAuthCheck(): Observable<boolean> {
    const token = this.getToken();
    
    if (!token) {
      return of(false);
    }

    return this.validateToken().pipe(
      tap(response => {
        const user: User = {
          id: response.userId,
          username: response.username,
          email: '',
          role: response.role as userRoles
        };
        this.currentUserSubject.next(user);
      }),
      map(() => true),
      catchError(error => {
        this.clearAuthData();
        return of(false);
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getRole(): Observable<userRoles | null> {
    const role = this.currentUser$.pipe(
      map(user => user ? user.role : null),
    );
    return role;
  }

  hasValidToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    const hasToken = this.hasValidToken();
    const hasUser = !!this.getCurrentUser();
    return hasToken && hasUser;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === userRoles.ADMIN;
  }

  hasRole(role: userRoles ): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}
