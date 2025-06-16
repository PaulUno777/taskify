import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Token {
  token: string;
  expiresIn: number;
  type: string;
}

interface AuthResponse {
  access: Token;
  refresh: Token;
}

interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.API_URL;
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  constructor() {
    const token = this.getAccessToken();
    if (token) {
      this.getProfile().subscribe();
    }
  }

  register(input: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, input)
      .pipe(
        tap((response) => {
          this.storeTokens(response);
          this.getProfile().subscribe();
        })
      );
  }

  login(input: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, input)
      .pipe(
        tap((response) => {
          this.storeTokens(response);
          this.getProfile().subscribe();
        })
      );
  }

  getProfile(): Observable<UserProfile> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http
      .get<UserProfile>(`${this.apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .pipe(
        tap((profile) => {
          this.currentUserSubject.next(profile);
        }),

        catchError((error) => {
          this.logout();

          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/refresh-token`, null, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .pipe(tap((response) => this.storeTokens(response)));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private storeTokens(tokens: AuthResponse): void {
    if (tokens.access) {
      localStorage.setItem('access_token', tokens.access.token);
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh.token);
    }
  }
}
