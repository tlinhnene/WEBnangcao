import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreApiService {
apiUrl = 'http://localhost:3002';

  constructor(private http: HttpClient) {}

  getProducts(minPrice: number, maxPrice: number, categoryId: string, sortPrice: string) {
    let params = new HttpParams()
      .set('minPrice', minPrice)
      .set('maxPrice', maxPrice);

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    if (sortPrice) {
      params = params.set('sortPrice', sortPrice);
    }

    return this.http.get(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: string) {
  return this.http.get<any>(`http://localhost:3002/products/${id}`);
}
  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  customerLogin(data: any) {
    return this.http.post(`${this.apiUrl}/customers/login`, data);
  }

  employeeLogin(data: any) {
    return this.http.post(`${this.apiUrl}/employees/login`, data);
  }

  createOrder(data: any) {
    return this.http.post(`${this.apiUrl}/orders`, data);
  }

  addOrderDetail(data: any) {
    return this.http.post(`${this.apiUrl}/orderdetails`, data);
  }

  getOrdersByCustomer(customerId: string) {
    return this.http.get(`${this.apiUrl}/orders/customer/${customerId}`);
  }

  getOrderDetails(orderId: string) {
    return this.http.get(`${this.apiUrl}/orderdetails/${orderId}`);
  }

  updateOrderDetail(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/orderdetails/${id}`, data);
  }

  deleteOrderDetail(id: string) {
    return this.http.delete(`${this.apiUrl}/orderdetails/${id}`);
  }

  payOrder(id: string) {
    return this.http.put(`${this.apiUrl}/orders/pay/${id}`, {});
  }

  getRevenue(month: number, year: number) {
    const params = new HttpParams()
      .set('month', month)
      .set('year', year);

    return this.http.get(`${this.apiUrl}/revenue`, { params });
  }
}