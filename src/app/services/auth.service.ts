import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUserDto } from '../models/login-user-dto';
import { RegisterUserDto } from '../models/register-user-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7118/api';
  private authApiUrl = `${this.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  login(loginData: LoginUserDto): Observable<any> {
    return this.http.post(`${this.authApiUrl}/login`, loginData);

  }

  register(registerData: RegisterUserDto): Observable<any> {
    return this.http.post(`${this.authApiUrl}/register`, registerData);
  }
}
