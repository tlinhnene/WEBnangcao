import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './home/home';
import { CurrentOrder } from './current-order/current-order';
import { Revenue } from './revenue/revenue';
import { Products } from './products/products';
import { Login } from './login/login';

const routes: Routes = [
  { path: 'cart', component: CurrentOrder },
  { path: 'revenue', component: Revenue },
  { path: 'product', component: Products },
  { path: 'login', component: Login },
  { path: '', component: Home, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}