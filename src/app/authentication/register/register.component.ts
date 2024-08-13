import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = { userName: '', email: '', password: '' };
  registrationError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.registrationError = '';

    this.authService.register(this.registerData).subscribe(
      (response: any) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userName', response.userName);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem("isAllTasks", "false");
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        this.registrationError = 'Registration failed. Please try again.';
        console.error('Registration failed', error);
      }
    );
  }
}
