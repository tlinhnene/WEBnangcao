import { Component } from '@angular/core';
import { FakeProductService } from '../myservices/fake-product-service';
@Component({
  selector: 'app-fake-product',
  standalone: false,
  templateUrl: './fake-product.html',
  styleUrl: './fake-product.css',
})
export class FakeProduct {
  data:any
  errMessage:string=''
  constructor(_service:FakeProductService){
    _service.getFakeProductData().subscribe({
      next:(data)=>{ this.data=data},
      error:(err)=>{
        this.errMessage=err
      }
    })
  }
}
