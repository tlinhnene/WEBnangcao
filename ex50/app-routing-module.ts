import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Listcustomer } from './listcustomer/listcustomer';
import { Listcustomer2 } from './listcustomer2/listcustomer2';
import { Listcustomer3 } from './listcustomer3/listcustomer3';
import { GioiThieu } from './gioi-thieu/gioi-thieu';
import { Notfound } from './notfound/notfound';
import { Listproduct } from './listproduct/listproduct';
import { Productdetail } from './productdetail/productdetail';
import { LoginComponent } from './logincomponent/logincomponent';
import { CourseRegisterComponent } from './course-register-component/course-register-component';
import { BookComponent } from './book-component/book-component';
import { BookDetailComponent } from './book-detail-component/book-detail-component';
import { NewBookComponent } from './new-book-component/new-book-component';
import { BookEditComponent } from './book-edit-component/book-edit-component';



const routes: Routes = [
  { path: '', redirectTo: 'san-pham-1', pathMatch: 'full' },

  { path: 'gioi-thieu', component: GioiThieu },
  { path: 'ex18', component: Listcustomer },
  { path: 'khach-hang2', component: Listcustomer2 },
  { path: 'khach-hang3', component: Listcustomer3 },

  { path: 'san-pham-1/:id', component: Productdetail },
  { path: 'san-pham-1', component: Listproduct },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: CourseRegisterComponent }, 


  {path:"ex39",component:BookComponent},
  {path:"ex41",component:BookDetailComponent},
  {path:"ex41/:id",component:BookDetailComponent},
  {path:"ex43",component: NewBookComponent},
  { path: 'ex50/:id', component: BookEditComponent },


  { path: '**', component: Notfound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
