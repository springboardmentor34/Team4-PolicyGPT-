import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

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
  department_id?: string | null;
}

export interface DepartmentOption {
  department_id: string;
  name: string;
  ministry: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl = API_CONFIG.BASE_URL;

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

  getDepartments(): Observable<DepartmentOption[]> {
    return this.http.get<DepartmentOption[]>(`${this.baseUrl}/auth/departments`);
  }

  forgotPassword(
    payload: ForgotPasswordRequest
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/forgot-password`,
      payload
    );
  }

  resetPassword(
    payload: ResetPasswordRequest
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/reset-password`,
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

  getUserNameFromToken(): string | null {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return (
        payload.full_name ??
        payload.name ??
        payload.username ??
        null
      );
    } catch (error) {
      console.error('Unable to decode user name from access token:', error);
      return null;
    }
  }
  getFirstNameFromToken(): string | null {
  const fullName = this.getUserNameFromToken();

  if (!fullName) {
    return null;
  }

  return fullName.trim().split(/\s+/)[0];
}
}