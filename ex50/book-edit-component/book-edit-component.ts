import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookAPIService } from '../myservices/BookAPIComponent';

@Component({
  selector: 'app-book-edit-component',
  standalone: false,
  templateUrl: './book-edit-component.html',
  styleUrl: './book-edit-component.css',
})
export class BookEditComponent {
  book: any = {};
  oldId = '';              
  okMessage = '';         
  errMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BookAPIService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.oldId = id;

    this.service.getBook(id).subscribe({
      next: (data) => {
        this.book = data;
        
        this.oldId = data?.BookId || id;
      },
      error: (err) => (this.errMessage = err?.message || JSON.stringify(err)),
    });
  }

  save() {
    this.errMessage = '';
    this.okMessage = '';

    const newId = (this.book?.BookId || '').trim();
    if (!newId) {
      this.errMessage = 'BookId is required';
      return;
    }

    if (newId === this.oldId) {
      this.service.updateBook(this.oldId, this.book).subscribe({
        next: () => {
          this.okMessage = 'Updated successfully';
          this.router.navigate(['/ex39']);
        },
        error: (err) => {
          this.errMessage = err?.message || JSON.stringify(err);
        },
      });
      return;
    }
    this.service.renameBook(this.oldId, this.book).subscribe({
      next: () => {
        this.okMessage = `Renamed ${this.oldId} → ${newId}`;
        this.router.navigate(['/ex39']);
      },
      error: (err) => {
        this.errMessage = err?.message || JSON.stringify(err);
      },
    });
  }

  cancel() {
    this.router.navigate(['/ex39']);
  }
  
}
