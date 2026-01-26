import { Component } from '@angular/core';
import { FakeProductService } from '../myservices/fake-product-service';

@Component({
  selector: 'app-fake-product-component2',
  standalone: false,
  templateUrl: './fake-product-component2.html',
  styleUrl: './fake-product-component2.css',
})
export class FakeProductComponent2 {
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
