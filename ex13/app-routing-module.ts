import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Listcustomer } from './listcustomer/listcustomer';
import { Listcustomer2 } from './listcustomer2/listcustomer2';
import { Listcustomer3 } from './listcustomer3/listcustomer3';
import { GioiThieu } from './gioi-thieu/gioi-thieu';
import { FakeProduct } from './fake-product/fake-product';
import { Notfound } from './notfound/notfound';
import { Listproduct } from './listproduct/listproduct';
import { Productdetail } from './productdetail/productdetail';
import {ServiceProductImageEvent} from './service-product-image-event/service-product-image-event'
import {ServiceProductImageEventDetail} from'./service-product-image-event-detail/service-product-image-event-detail'

const routes: Routes = [
  { path: 'gioi-thieu', component: GioiThieu },
  { path: 'khach-hang-1', component: Listcustomer },
  { path: 'khach-hang-2', component: Listcustomer2 },
  { path: 'khach-hang-3', component: Listcustomer3 },
  {path: 'san-pham-1', component:Listproduct},
  {path:'san-pham-1/:id',component:Productdetail},
  { path: 'ex26', component: FakeProduct },
  {path:'service-product-image-event', component: ServiceProductImageEvent},
  {path:'service-product-image-event/:id',component: ServiceProductImageEventDetail},
  { path: '**', component: Notfound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
