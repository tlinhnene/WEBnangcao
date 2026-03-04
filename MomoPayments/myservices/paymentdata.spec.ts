import { TestBed } from '@angular/core/testing';

import { Paymentdata } from './paymentdata';

describe('Paymentdata', () => {
  let service: Paymentdata;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Paymentdata);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
