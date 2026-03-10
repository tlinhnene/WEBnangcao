import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionClientDetail } from './fashion-client-detail';

describe('FashionClientDetail', () => {
  let component: FashionClientDetail;
  let fixture: ComponentFixture<FashionClientDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FashionClientDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FashionClientDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
