import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './product-component/product-component';
import { ListProductComponent } from './list-product-component/list-product-component';
import { ServiceProductComponent } from './service-product-component/service-product-component';
const routes: Routes = [

  { path: 'product', component: ProductComponent },
  { path: 'list-product', component: ListProductComponent },
  { path: 'service-product', component: ServiceProductComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
