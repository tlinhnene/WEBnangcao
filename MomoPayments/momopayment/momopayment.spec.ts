import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Momopayment } from './momopayment';

describe('Momopayment', () => {
  let component: Momopayment;
  let fixture: ComponentFixture<Momopayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Momopayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Momopayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
