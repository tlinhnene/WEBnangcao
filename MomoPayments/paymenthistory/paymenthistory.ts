import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-paymenthistory',
  standalone: false,
  templateUrl: './paymenthistory.html',
  styleUrl: './paymenthistory.css',
})
export class Paymenthistory {
payments: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.http.get<any[]>("http://localhost:3002/api/momo/payments")
      .subscribe(data => {
        this.payments = data;
      });
  }
}
