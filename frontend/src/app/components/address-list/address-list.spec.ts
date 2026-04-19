import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressListComponent } from './address-list';

describe('AddressList', () => {
  let component: AddressListComponent;
  let fixture: ComponentFixture<AddressListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
