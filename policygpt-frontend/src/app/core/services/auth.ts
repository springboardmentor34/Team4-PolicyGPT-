import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role: string;
  phone?: string | null;
  state?: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.baseUrl}/auth/login`,
      payload
    );
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/register`,
      payload
    );
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch (error) {
      console.error('Unable to decode access token:', error);
      return null;
    }
  }
}