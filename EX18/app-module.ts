import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';

import { AppComponent } from './app';
import { GioiThieu } from './gioi-thieu/gioi-thieu';
import { Listcustomer } from './listcustomer/listcustomer';
import { Listcustomer2 } from './listcustomer2/listcustomer2';
import { Listcustomer3 } from './listcustomer3/listcustomer3';
import { Notfound } from './notfound/notfound';
import { FakeProduct } from './fake-product/fake-product';
import { Listproduct } from './listproduct/listproduct';
import { Productdetail } from './productdetail/productdetail';
import { ServiceProductImageEvent } from './service-product-image-event/service-product-image-event';
import { ServiceProductImageEventDetail } from './service-product-image-event-detail/service-product-image-event-detail';
import { FakeProductComponent2 } from './fake-product-component2/fake-product-component2';


@NgModule({
  declarations: [
    AppComponent,
    GioiThieu,
    Listcustomer,
    Listcustomer2,
    Listcustomer3,
    FakeProduct,
    Listproduct,
    Productdetail,
    Notfound,
    ServiceProductImageEvent,
    ServiceProductImageEventDetail,
    FakeProductComponent2,
  ],
  imports: [
    BrowserModule,
    CommonModule,      
    FormsModule,     
    HttpClientModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
