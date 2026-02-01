import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logincomponent',
  standalone: false,
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class LoginComponent implements OnInit {

  messageJson: string = '';   // hiển thị JSON dưới nút Login (màu đỏ)
  errorMsg: string = '';

  loginForm: any;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      remember: [false]
    });
  }

  ngOnInit(): void {
    // load login đã lưu
    const saved = localStorage.getItem('LOGIN_INFO');
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        this.loginForm.patchValue({
          email: obj.email || '',
          password: obj.password || '',
          remember: true
        });
      } catch {}
    }
  }

  onLogin(): void {
    this.errorMsg = '';
    this.messageJson = '';

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMsg = 'Invalid email or password.';
      return;
    }

    const data = this.loginForm.value;

    // 1) hiển thị JSON string dưới button (đúng yêu cầu)
    this.messageJson = JSON.stringify(data);

    // 2) Remember me (LocalStorage)
    if (data.remember) {
      localStorage.setItem('LOGIN_INFO', JSON.stringify({ email: data.email, password: data.password }));
    } else {
      localStorage.removeItem('LOGIN_INFO');
    }

    // 3) Simulation login đúng thì navigate
    // Bạn đổi email/password đúng theo ý bạn (ví dụ thầy cho)
    const CORRECT_EMAIL = 'admin@gmail.com';
    const CORRECT_PASS = '12345';

    if (data.email === CORRECT_EMAIL && data.password === CORRECT_PASS) {
      // navigate qua 1 component bất kỳ (ví dụ ex19-product)
      this.router.navigateByUrl('/ex19-product');
    } else {
      this.errorMsg = 'Login failed (wrong email/password).';
    }
  }

  get f() {
    return this.loginForm.controls;
  }
}