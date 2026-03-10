import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionClient } from './fashion-client';

describe('FashionClient', () => {
  let component: FashionClient;
  let fixture: ComponentFixture<FashionClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FashionClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FashionClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
