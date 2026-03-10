import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Fashion } from '../models/Fashion';

@Injectable({
  providedIn: 'root'
})
export class FashionAPIService {

  constructor(private _http: HttpClient) { }

  getFashions(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8');

    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    };

    return this._http.get<any>('/fashions', requestOptions).pipe(
      map(res => JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    );
  }

 getFashion(id: string): Observable<any> {
  return this._http.get<any>(`/fashions/${id}`).pipe(
    retry(3),
    catchError(this.handleError)
  );
}

  getFashionsByStyle(style: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8');

    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    };

    return this._http.get<any>(`/fashions/style/${style}`, requestOptions).pipe(
      map(res => JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    );
  }

  createFashion(fashion: Fashion): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');

    return this._http.post<any>('/fashions', fashion, { headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateFashion(id: string, fashion: Fashion): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');

    return this._http.put<any>(`/fashions/${id}`, fashion, { headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  deleteFashion(id: string): Observable<any> {
    return this._http.delete<any>(`/fashions/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}