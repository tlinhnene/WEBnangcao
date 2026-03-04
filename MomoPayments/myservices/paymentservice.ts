import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Paymentservice {
  constructor(private http: HttpClient) {}

  createPayment(amount: number) {
    return this.http.post<any>(
      "http://localhost:3002/payment/momo",
      { amount: amount }
    );
  }
}
