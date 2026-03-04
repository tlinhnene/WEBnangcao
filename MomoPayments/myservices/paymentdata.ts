import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Paymentdata {
  http: any;
getPayments() {
  return this.http.get('/payments');
}
}
