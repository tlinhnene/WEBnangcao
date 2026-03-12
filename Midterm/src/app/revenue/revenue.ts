import { Component } from '@angular/core';
import { StoreApiService } from '../services/store-api.service';

@Component({
  selector: 'app-revenue',
  standalone: false,
  templateUrl: './revenue.html',
  styleUrl: './revenue.css',
})
export class Revenue {
  month: number = 3;
  year: number = 2026;
  result: any[] = [];
  message = '';

  constructor(private service: StoreApiService) {}

  loadRevenue() {
    const role = localStorage.getItem('role');

    if (role !== 'employee') {
      this.message = 'Only employee can view revenue statistics';
      this.result = [];
      return;
    }

    this.service.getRevenue(this.month, this.year).subscribe((data: any) => {
      this.result = data;
      this.message = '';
    });
  }

}
