import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { StudentInfo } from './student-info/student-info';
import { Login } from './login/login';
import { Home } from './home/home';
import { Products } from './products/products';
import { CurrentOrder } from './current-order/current-order';
import { Revenue } from './revenue/revenue';
import { Productdetail } from './productdetail/productdetail';

@NgModule({
  declarations: [
    App,
    StudentInfo,
    Login,
    Home,
    Products,
    CurrentOrder,
    Revenue,
    Productdetail,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule {}