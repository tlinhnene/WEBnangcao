import { Component } from '@angular/core';
import { FashionAPIService } from '../myservices/Fashion-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fashion-client',
  standalone: false,
  templateUrl: './fashion-client.html',
  styleUrl: './fashion-client.css',
})
export class FashionClient {
  fashions: any[] = [];
  groupedFashions: any = {};
  styleList: string[] = [];
  selectedStyle: string = '';
  errMessage: string = '';

  constructor(
    private _service: FashionAPIService,
    private router: Router
  ) {
    this.loadAll();
  }

  loadAll() {
    this._service.getFashions().subscribe({
      next: (data) => {
        this.fashions = data.data;
        this.makeStyleList();
        this.groupByStyle();
      },
      error: (err) => {
        this.errMessage = err.message;
      }
    });
  }

  makeStyleList() {
    const temp = this.fashions.map(x => x.style);
    this.styleList = [...new Set(temp)];
  }

  groupByStyle() {
    this.groupedFashions = {};

    for (let item of this.fashions) {
      if (!this.groupedFashions[item.style]) {
        this.groupedFashions[item.style] = [];
      }
      this.groupedFashions[item.style].push(item);
    }
  }

  filterByStyle() {
    if (!this.selectedStyle) {
      this.loadAll();
      return;
    }

    this._service.getFashionsByStyle(this.selectedStyle).subscribe({
      next: (data) => {
        this.fashions = data.data;
        this.groupByStyle();
      },
      error: (err) => {
        this.errMessage = err.message;
      }
    });
  }

  viewDetail(id: string) {
  this.router.navigate(['/fashion-client-detail', id]);
}

  getStyleKeys() {
    return Object.keys(this.groupedFashions);
  }
}
