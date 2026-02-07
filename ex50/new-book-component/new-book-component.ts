import { Component, OnInit } from '@angular/core';
import { BookAPIService } from '../myservices/BookAPIComponent';
import { Book } from '../myclasses/iBook';

@Component({
  selector: 'app-new-book-component',
  standalone: false,
  templateUrl: './new-book-component.html',
  styleUrls: ['./new-book-component.css'],
})
export class NewBookComponent implements OnInit {
  book = new Book();
  books: any[] = [];
  errMessage = '';
  okMessage = '';

  constructor(private _service: BookAPIService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this._service.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        this.errMessage = err?.message || String(err);
      },
    });
  }

  postBook() {
  this.okMessage = '';
  this.errMessage = '';

  this._service.postBook(this.book).subscribe({
    next: (data) => {
      this.books = data;
      this.okMessage = `Đã tạo sách: ${this.book.BookId}`;
      this.book = new Book();
    },
    error: (err) => {
      this.errMessage = err?.message || String(err);
    }
  });
}
}
