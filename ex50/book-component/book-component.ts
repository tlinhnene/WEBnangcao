import { Component } from '@angular/core';
import { BookAPIService } from '../myservices/BookAPIComponent';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-component',
  standalone: false,
  templateUrl: './book-component.html',
  styleUrl: './book-component.css',
})
export class BookComponent {
  books:any;
  errMessage:string=''
  constructor(private _service: BookAPIService,private router:Router,private activeRouter:ActivatedRoute){
    this._service.getBooks().subscribe({
    next:(data)=>{this.books=data},
    error:(err)=>{this.errMessage=err}
    })
  }
  view_detail(bookId:any)
  {
    this.router.navigate(["ex41",bookId])
  }
deleteBook(id: string) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  this._service.deleteBook(id).subscribe({
    next: (data) => {
      this.books = data; 
    },
    error: (err) => {
      this.errMessage = err?.message || JSON.stringify(err);
    }
  });
}


}
