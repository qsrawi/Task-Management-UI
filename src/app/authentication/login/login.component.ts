import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { decodeToken } from '../../helper/jwt-decode';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { userName: '', password: '' };
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router, private localStorageService: LocalStorageService) {}

  onSubmit() {
    this.loginError = '';

    this.authService.login(this.loginData).subscribe(
      (response: any) => {
        this.localStorageService.setItem('authToken', response.token);
        this.localStorageService.setItem('isAllTasks', 'false');
        this.router.navigate([`/${decodeToken().toLowerCase()}/task-list`]);
      },
      (error) => {
        this.loginError = 'Login failed. Please check your user name and password.';
        console.error('Login failed', error);
      }
    );
  }
}
