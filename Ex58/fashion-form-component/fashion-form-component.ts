import { Component } from '@angular/core';
import { Fashion } from '../models/Fashion';
import { FashionAPIService } from '../myservices/Fashion-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-fashion-form-component',
  standalone: false,
  templateUrl: './fashion-form-component.html',
  styleUrl: './fashion-form-component.css',
})
export class FashionFormComponent {
  public Editor: any = ClassicEditor;

  fashion: Fashion = new Fashion();
  errMessage: string = "";
  isEdit: boolean = false;
  id: string = "";

  constructor(
    private _service: FashionAPIService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.isEdit = true;
      this.id = idParam;

      this._service.getFashion(this.id).subscribe({
        next: (data) => {
          this.fashion = data.data;
        },
        error: (err) => {
          this.errMessage = err.message;
        }
      });
    }
  }

  saveFashion() {
    if (!this.fashion.style || !this.fashion.fashion_subject || !this.fashion.fashion_detail || !this.fashion.fashion_image) {
      this.errMessage = "Please fill all fields";
      return;
    }

    if (this.isEdit) {
      this._service.updateFashion(this.id, this.fashion).subscribe({
        next: () => {
          this.router.navigate(['/ex53']);
        },
        error: (err) => {
          this.errMessage = err.message;
        }
      });
    } else {
      this._service.createFashion(this.fashion).subscribe({
        next: () => {
          this.router.navigate(['/ex53']);
        },
        error: (err) => {
          this.errMessage = err.message;
        }
      });
    }
  }
}