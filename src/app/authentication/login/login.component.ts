import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
      (response: any) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem("isAllTasks", "false");
        this.router.navigate([`/${response.role.toLowerCase()}/task-list`, response.id]);
      },
      (error) => {
        this.loginError = 'Login failed. Please check your user name and password.';
        console.error('Login failed', error);
      }
    );
  }
}
