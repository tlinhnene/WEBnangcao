import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FashionAPIService } from '../myservices/Fashion-api.service';

@Component({
  selector: 'app-fashion-client-detail',
  standalone: false,
  templateUrl: './fashion-client-detail.html',
  styleUrl: './fashion-client-detail.css',
})
export class FashionClientDetail {
  fashion: any = null;
  errMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: FashionAPIService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.errMessage = 'No ID found';
        return;
      }

      this.service.getFashion(id).subscribe({
        next: (res) => {
          console.log('DETAIL =', res);
          this.fashion = res.data;
        },
        error: (err) => {
          this.errMessage = err.message;
        }
      });
    });
  }
}
