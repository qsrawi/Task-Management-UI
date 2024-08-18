import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { decodeToken } from '../../helper/jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { userName: '', password: '' };
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loginError = '';

    this.authService.login(this.loginData).subscribe(
      (token: string) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem("isAllTasks", "false");
        this.router.navigate([`/${decodeToken('Role').toLowerCase()}/task-list`]);
      },
      (error) => {
        this.loginError = 'Login failed. Please check your user name and password.';
        console.error('Login failed', error);
      }
    );
  }
}
