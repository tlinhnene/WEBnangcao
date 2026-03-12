import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreApiService } from '../services/store-api.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: any[] = [];
  categories: any[] = [];

  minPrice: number = 0;
  maxPrice: number = 1000;
  categoryId: string = '';
  sortPrice: string = '';

  errMessage: string = '';

  constructor(
    private service: StoreApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.errMessage = '';

    this.service
      .getProducts(
        this.minPrice,
        this.maxPrice,
        this.categoryId,
        this.sortPrice
      )
      .subscribe({
        next: (data: any) => {
          this.products = data;
        },
        error: (err) => {
          this.errMessage = err.message || 'Cannot load products';
        },
      });
  }

  loadCategories(): void {
    this.service.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  viewDetail(product: any): void {
    this.router.navigate(['/product', product.productId]);
  }

  buy(product: any): void {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!user || role !== 'customer') {
      alert('Customer must login first');
      this.router.navigate(['/login']);
      return;
    }

    const customer = JSON.parse(user);

    const orderData = {
      customerId: customer.customerId,
      status: 'cart',
      totalAmount: product.price,
      paymentStatus: 'unpaid',
    };

    this.service.createOrder(orderData).subscribe({
      next: (orderRes: any) => {
        const orderId = orderRes.insertedId;

        const detailData = {
          orderId: orderId,
          productId: product.productId,
          quantity: 1,
          price: product.price,
        };

        this.service.addOrderDetail(detailData).subscribe({
          next: () => {
            alert('Added to cart');
          },
          error: (err) => {
            alert(err.message || 'Cannot add order detail');
          },
        });
      },
      error: (err) => {
        alert(err.message || 'Cannot create order');
      },
    });
  }

  applyFilter(): void {
    this.loadProducts();
  }

  resetFilter(): void {
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.categoryId = '';
    this.sortPrice = '';
    this.loadProducts();
  }
}