import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeProductComponent2 } from './fake-product-component2';

describe('FakeProductComponent2', () => {
  let component: FakeProductComponent2;
  let fixture: ComponentFixture<FakeProductComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FakeProductComponent2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeProductComponent2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
