import { Component, OnInit, OnDestroy } from '@angular/core';
import { BitcoinService, BPIData } from '../myservices/bitcoin'

@Component({
    selector: 'app-ex28',
    standalone: false,
    templateUrl: './ex28.html',
    styleUrl: './ex28.css',
})
export class Ex28 implements OnInit, OnDestroy {
    bpiData: BPIData | null = null;
    errMessage: string = '';
    loading: boolean = true;
    refreshInterval: any;

    constructor(private _service: BitcoinService) {
        this.fetchBpi();
    }

    ngOnInit(): void {
        this.refreshInterval = setInterval(() => {
            this.fetchBpi();
        }, 60000);
    }

    ngOnDestroy(): void {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    fetchBpi(): void {
        this.loading = true;
        this._service.getBitcoinData().subscribe({
            next: (data) => {
                this.bpiData = data;
                this.loading = false;
                this.errMessage = '';
            },
            error: (err) => {
                this.errMessage = err.message || 'Failed to fetch Bitcoin prices.';
                this.loading = false;
            }
        });
    }

    getCurrencies() {
        if (!this.bpiData || !this.bpiData.bpi) return [];
        return Object.values(this.bpiData.bpi);
    }
}