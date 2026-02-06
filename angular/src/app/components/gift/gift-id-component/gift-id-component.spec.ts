import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftIdComponent } from './gift-id-component';

describe('GiftIdComponent', () => {
  let component: GiftIdComponent;
  let fixture: ComponentFixture<GiftIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftIdComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
