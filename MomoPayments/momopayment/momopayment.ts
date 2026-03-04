import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-momopayment',
  standalone: false,
  templateUrl: './momopayment.html',
  styleUrl: './momopayment.css',
})
export class Momopayment {
amount: number = 0;

  constructor(private http: HttpClient) {}

  payWithMomo() {
     this.http.post<any>("http://localhost:3002/api/momo/create", {
      amount: this.amount
    })
    .subscribe(res => {

      console.log("Saved to DB, response:", res);

      if (res.payUrl) {
        window.location.href = res.payUrl;
      }
    });
  }
}
