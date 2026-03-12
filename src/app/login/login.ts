import { Component } from '@angular/core';
import { StoreApiService } from '../services/store-api.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  role = 'customer';
  message = '';
  currentUser: any = null;

  constructor(private service: StoreApiService) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.message = 'Welcome ' + this.currentUser.fullName;
    }
  }

  login() {
    const data = {
      email: this.email,
      password: this.password
    };

    if (this.role === 'customer') {
      this.service.customerLogin(data).subscribe({
        next: (res: any) => {
          this.currentUser = res.user;
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('role', 'customer');
          this.message = 'Welcome ' + res.user.fullName;
        },
        error: () => {
          this.message = 'Customer login failed';
        }
      });
    } else {
      this.service.employeeLogin(data).subscribe({
        next: (res: any) => {
          this.currentUser = res.user;
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('role', 'employee');
          this.message = 'Welcome ' + res.user.fullName;
        },
        error: () => {
          this.message = 'Employee login failed';
        }
      });
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.message = 'Logged out';
  }
}