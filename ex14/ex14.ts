import { Component } from '@angular/core';
import { CatalogService } from '../catalog-service';

@Component({
  selector: 'app-ex14',
  standalone: false,
  templateUrl: './ex14.html',
  styleUrls: ['./ex14.css'],
})
export class Ex14 {
  categories: any[] = [];

  constructor(private cs: CatalogService) {
    this.categories = this.cs.getCategories();
  }
}
