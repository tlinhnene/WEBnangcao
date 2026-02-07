import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app';
import { GioiThieu } from './gioi-thieu/gioi-thieu';
import { Listcustomer } from './listcustomer/listcustomer';
import { Listcustomer2 } from './listcustomer2/listcustomer2';
import { Listcustomer3 } from './listcustomer3/listcustomer3';
import { Notfound } from './notfound/notfound';
import { Listproduct } from './listproduct/listproduct';
import { Productdetail } from './productdetail/productdetail';
import { ServiceProductImageEventDetail } from './service-product-image-event-detail/service-product-image-event-detail';
import { LoginComponent } from './logincomponent/logincomponent';
import { CourseRegisterComponent } from './course-register-component/course-register-component';
import { BookComponent } from './book-component/book-component';
import { BookDetailComponent } from './book-detail-component/book-detail-component';
import { NewBookComponent } from './new-book-component/new-book-component';
import { BookEditComponent } from './book-edit-component/book-edit-component';




@NgModule({
  declarations: [
    AppComponent,
    GioiThieu,
    Listcustomer,
    Listcustomer2,
    Listcustomer3,
    Listproduct,
    Productdetail,
    Notfound,
    ServiceProductImageEventDetail,
    LoginComponent,
    CourseRegisterComponent,
    BookComponent,
    BookDetailComponent,
    NewBookComponent,
    BookEditComponent,



  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
