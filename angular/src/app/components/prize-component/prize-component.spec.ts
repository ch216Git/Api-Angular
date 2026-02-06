import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeComponent } from './prize-component';

describe('PrizeComponent', () => {
  let component: PrizeComponent;
  let fixture: ComponentFixture<PrizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
