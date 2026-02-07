import { Component } from '@angular/core';
import { BookAPIService } from '../myservices/BookAPIComponent';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-detail-component',
  standalone: false,
  templateUrl: './book-detail-component.html',
  styleUrl: './book-detail-component.css',
})
export class BookDetailComponent {
   book:any;
  errMessage:string=''
  constructor(private _service: BookAPIService,
    private router:Router,
    private activeRouter:ActivatedRoute){
      activeRouter.paramMap.subscribe((param)=>{
        let id=param.get("id")
        if (id!=null)
        {
          this.searchBook(id)
        }
      })
  }
  searchBook(bookId:string)
  {
    this._service.getBook(bookId).subscribe({
    next:(data)=>{this.book=data},
    error:(err)=>{this.errMessage=err}
    })
  }
}
