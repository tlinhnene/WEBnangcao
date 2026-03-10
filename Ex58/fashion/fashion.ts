import { Component } from '@angular/core';
import { FashionAPIService } from '../myservices/Fashion-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fashion',
  standalone: false,
  templateUrl: './fashion.html',
  styleUrl: './fashion.css',
})
export class Fashion {
  fashions: any[] = [];
  errMessage: string = "";
  selectedStyle: string = "";

  constructor(
    public _service: FashionAPIService,
    private router: Router
  ) {
    this.loadAll();
  }

  loadAll() {
    this._service.getFashions().subscribe({
      next: (data) => {
        this.fashions = data.data;
      },
      error: (err) => {
        this.errMessage = err.message;
      }
    });
  }

  filterByStyle() {
    if (!this.selectedStyle.trim()) {
      this.loadAll();
      return;
    }

    this._service.getFashionsByStyle(this.selectedStyle).subscribe({
      next: (data) => {
        this.fashions = data.data;
      },
      error: (err) => {
        this.errMessage = err.message;
      }
    });
  }

  addNewFashion() {
    this.router.navigate(['/fashion-form']);
  }

  viewDetail(id: string) {
    this.router.navigate(['/fashion-detail', id]);
  }

  editFashion(id: string) {
    this.router.navigate(['/fashion-form', id]);
  }

  deleteFashion(id: string) {
    const ok = confirm("Bạn có chắc muốn xóa fashion này không?");
    if (!ok) return;

    this._service.deleteFashion(id).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => {
        this.errMessage = err.message;
      }
    });
  }
}