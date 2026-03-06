import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  username: string = '';
  password: string = '';
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.readCookie();
  }

  login() {
    this.message = '';
    this.error = '';

    this.http.post<any>(
      'http://localhost:3002/login',
      {
        username: this.username,
        password: this.password
      },
      {
        withCredentials: true
      }
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = res.message;
          this.error = '';
          this.readCookie();
        } else {
          this.error = res.message || 'Login failed';
          this.message = '';
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.message = '';
      }
    });
  }

  readCookie() {
    this.http.get<any>(
      'http://localhost:3002/read-login-cookie',
      {
        withCredentials: true
      }
    ).subscribe({
      next: (res) => {
        this.username = res.username || '';
        this.password = res.password || '';
      }
    });
  }
}