import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = { userName: '', email: '', password: '' };
  registrationError: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,) {}

  onSubmit() {
    this.registrationError = '';

    this.authService.register(this.registerData).subscribe(
      () => {
        this.toastr.success('User Registered successfully', 'Success');
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        this.registrationError = 'Registration failed. Please try again.';
        console.error('Registration failed', error);
      }
    );
  }
}
