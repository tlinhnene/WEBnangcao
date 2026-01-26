import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Listcustomer } from './listcustomer';

describe('Listcustomer', () => {
  let component: Listcustomer;
  let fixture: ComponentFixture<Listcustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listcustomer],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Listcustomer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
