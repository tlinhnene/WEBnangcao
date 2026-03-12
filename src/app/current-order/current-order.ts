import { Component } from '@angular/core';
import { StoreApiService } from '../services/store-api.service';

@Component({
  selector: 'app-current-order',
  standalone: false,
  templateUrl: './current-order.html',
  styleUrl: './current-order.css',
})
export class CurrentOrder {
  orderId = '';
  details: any[] = [];

  constructor(private service: StoreApiService) {}

  loadOrderDetails() {
    if (!this.orderId) return;

    this.service.getOrderDetails(this.orderId).subscribe((data: any) => {
      this.details = data;
    });
  }

  updateQty(item: any) {
    this.service.updateOrderDetail(item._id, {
      quantity: item.quantity,
      price: item.price
    }).subscribe(() => {
      alert('Updated');
      this.loadOrderDetails();
    });
  }

  removeItem(id: string) {
    this.service.deleteOrderDetail(id).subscribe(() => {
      alert('Removed');
      this.loadOrderDetails();
    });
  }

  payOrder() {
    if (!this.orderId) return;

    this.service.payOrder(this.orderId).subscribe(() => {
      alert('Payment success');
    });
  }

}
