import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrizeComponent } from './prize-component';
import { ToastModule } from 'primeng/toast'; // ייבוא ל-TestBed
import { MessageService } from 'primeng/api'; // ייבוא ל-TestBed

describe('PrizeComponent', () => {
  let component: PrizeComponent;
  let fixture: ComponentFixture<PrizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizeComponent, ToastModule], // הוספה ל-imports
      providers: [MessageService] // הוספה ל-providers
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