import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FashionAPIService } from '../myservices/Fashion-api.service';

@Component({
  selector: 'app-fashion-detail-component',
  standalone: false,
  templateUrl: './fashion-detail-component.html',
  styleUrls: ['./fashion-detail-component.css']
})
export class FashionDetailComponent implements OnInit {
  fashionId: string = '';
  fashion: any = null;
  errMessage: string = '';

  constructor(
    private service: FashionAPIService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fashionId = id;
        this.search();
      }
    });
  }

  search(): void {
  this.errMessage = '';
  this.fashion = null;

  const id = this.fashionId.trim();
  if (!id) {
    this.errMessage = 'Please enter Fashion ID';
    return;
  }

  console.log('SEARCH ID =', id);

  this.service.getFashion(id).subscribe({
    next: (data) => {
      console.log('DETAIL RESPONSE =', data);
      console.log('DETAIL RESPONSE TYPE =', typeof data);

      this.fashion = data?.data ?? data ?? null;

      console.log('FASHION AFTER MAP =', this.fashion);

      if (!this.fashion) {
        this.errMessage = 'No detail data returned';
      }
    },
    error: (err) => {
      console.log('DETAIL ERROR =', err);
      this.errMessage = err?.message || JSON.stringify(err);
    }
  });
}
}