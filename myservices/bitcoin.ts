import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

export interface BPIData {
    time: { updated: string };
    disclaimer: string;
    bpi: {
        [key: string]: {
            code: string;
            rate: string;
            description: string;
            symbol: string;
        }
    };
}

@Injectable({
    providedIn: 'root',
})
export class BitcoinService {
    private _url: string = "/v1/bpi"

    constructor(private _http: HttpClient) { }

    getBitcoinData(): Observable<BPIData> {
        const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8")
        const requestOptions: Object = {
            headers: headers,
            responseType: "text"
        }
        return this._http.get<any>(this._url, requestOptions).pipe(
            map(res => {
                const raw = JSON.parse(res);
                // Map Blockchain.info format to our BPIData interface
                return {
                    time: { updated: new Date().toLocaleString() },
                    disclaimer: "Data provided by Blockchain.info Hub",
                    bpi: {
                        USD: { code: "USD", rate: raw.USD.last.toLocaleString(), description: "United States Dollar", symbol: "$" },
                        GBP: { code: "GBP", rate: raw.GBP.last.toLocaleString(), description: "British Pound Sterling", symbol: "£" },
                        EUR: { code: "EUR", rate: raw.EUR.last.toLocaleString(), description: "Euro", symbol: "€" }
                    }
                } as BPIData;
            }),
            retry(3),
            catchError(this.handleError))
    }

    handleError(error: HttpErrorResponse) {
        return throwError(() => new Error(error.message))
    }
}