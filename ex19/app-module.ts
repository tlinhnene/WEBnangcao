import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { ProductComponent } from './product-component/product-component';
import { ListProductComponent } from './list-product-component/list-product-component';
import { ServiceProductComponent } from './service-product-component/service-product-component';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ListProductComponent,
    ServiceProductComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
