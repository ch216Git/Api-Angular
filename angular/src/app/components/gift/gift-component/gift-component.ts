import { GiftService } from '../../../services/gift-service';
import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftWithWinner } from '../../../models/gift.model';
import { RouterModule, Router } from '@angular/router';
import { BasketService } from '../../../services/basket-service';
import { AddGiftToBasket, GetBasketById, MyDecodedToken } from '../../../models/basket.model';
import { jwtDecode } from 'jwt-decode';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { GetCategory, GetCategoryById } from '../../../models/category.model';
import { CategoryService } from '../../../services/category-service';
import { PrizeService } from '../../../services/prize-service';
import { GetPrize } from '../../../models/prize.model';
import { UserService } from '../../../services/userService';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-gift-component',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, FormsModule, InputNumberModule, ToastModule],
  templateUrl: './gift-component.html',
  styleUrl: './gift-component.scss',
  providers: [MessageService]
})
export class GiftComponent implements OnInit {

  constructor(private router: Router) { }

  messageService: MessageService = inject(MessageService);
  giftService: GiftService = inject(GiftService);
  basketService: BasketService = inject(BasketService);
  prizeService: PrizeService = inject(PrizeService);
  userService: UserService = inject(UserService);
  categoryService: CategoryService = inject(CategoryService);

  // --- Signals (במקום משתנים רגילים) כדי למנוע את הצורך ב-Change Detection ידני ---
  listGifts = signal<GiftWithWinner[]>([]);
  listValue = signal<number[]>([]);
  listCategory = signal<GetCategory[]>([]);
  listCategoryWithGifts = signal<GetCategoryById[]>([]);
  isLoaded = signal(false);
  prize = signal(false);

  // משתני עזר ומידע
  basket!: GetBasketById;
  listPrize: GetPrize[] = [];
  originalGifts: GiftWithWinner[] = [];
  role: string = '';
  selectedCategoryId: number | null = null;

  // Signals לחיפוש ומיון
  selectedValue = signal('');
  selectedSearcheValue = signal('searchByGiftName');
  nameSignal = signal('');

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const decoded = jwtDecode<MyDecodedToken>(token);
    this.role = decoded.role;

    this.getAllGifts();
    this.getAllCategory();

    this.prizeService.getAllPrizes().subscribe(prizes => {
      this.listPrize = prizes;
      if (this.listPrize.length > 0)
        this.prize.set(true);
      this.matchGiftsWithPrizes();
    });
  }

  onSearchTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSearcheValue.set(select.value);
  }

  // חיפוש - עדכון ה-Signal של הרשימה מעדכן את ה-UI אוטומטית
  onSearchChange(value: string) {
    this.nameSignal.set(value);
    const searchText = value.trim();
    if (!searchText) {
      this.listGifts.set([...this.originalGifts]);
      this.syncListValue();
      this.matchGiftsWithPrizes();
      return;
    }

    let searchObservable;
    if (this.selectedSearcheValue() === 'searchByGiftName')
      searchObservable = this.giftService.exsistsGiftName(searchText);
    else if (this.selectedSearcheValue() === 'searchByDonorName')
      searchObservable = this.giftService.existsDonorName(searchText);
    else if (this.selectedSearcheValue() === 'searchByCustomer')
      searchObservable = this.giftService.existsSumCoustomerGift(Number(searchText));

    searchObservable?.subscribe(data => {
      this.listGifts.set(data ?? []);
      this.syncListValue();
      this.matchGiftsWithPrizes();
    });
  }

  onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedValue.set(select.value);
    this.runAction();
  }

  runAction() {
    let action;
    if (this.selectedValue() === 'sortByPrice')
      action = this.giftService.sortGiftsByPrice();
    else if (this.selectedValue() === 'sortByBuyer')
      action = this.giftService.sortGiftsByBuyer();
    else if (this.selectedValue() === 'noSort') { this.getAllGifts(); return; }

    action?.subscribe(data => {
      this.listGifts.set(data);
      this.syncListValue();
      this.matchGiftsWithPrizes();
    });
  }

  private syncListValue() {
    this.listValue.set(this.listGifts().map(() => 1));
  }

  private matchGiftsWithPrizes() {
    const currentGifts = this.listGifts();
    currentGifts.forEach(gift => {
      const p = this.listPrize.find(prize => prize.giftId === gift.id);
      if (p) {
        this.userService.getUserById(p.userId).subscribe(user => {
          gift['winner'] = user;
          this.listGifts.set([...currentGifts]); // עדכון ה-Signal גורם לריענון ה-UI
        });
      } else {
        gift['winner'] = null;
      }
    });
  }

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe(data => {
      this.listCategory.set(data);
      this.listCategoryWithGifts.set([]); // איפוס לפני טעינה
      data.forEach(cat => {
        this.categoryService.getCategoryById(cat.id).subscribe(c => {
          this.listCategoryWithGifts.update(list => [...list, c]);
        });
      });
    });
  }

  deleteGift(id: number) {
    this.giftService.deleteGift(id).subscribe({
      next: () => {
        this.listGifts.update(list => list.filter(g => g.id !== id));
      },
      error: err => {
        const errorMessage = typeof err.error === 'string'
          ? err.error
          : this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן למחוק מתנה שנמצאת בסל קניות או בהזמנה של לקוח.' });
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: errorMessage });
      }
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.listCategoryWithGifts.update(list => list.filter(c => c.id !== id));
      this.messageService.add({ severity: 'success', detail: 'הקטגוריה נמחקה' });
    });
  }

  getCategoryById(id: number) {
    this.selectedCategoryId = id;
    this.isLoaded.set(false);
    this.categoryService.getCategoryById(id).subscribe(data => {
      this.listGifts.set(data.gifts ?? []);
      this.syncListValue();
      this.matchGiftsWithPrizes();
      this.isLoaded.set(true);
    });
  }

  getAllGifts() {
    this.selectedCategoryId = null;
    this.isLoaded.set(false);
    this.giftService.getAllGift().subscribe(data => {
      this.originalGifts = data;
      this.listGifts.set([...this.originalGifts]);
      this.syncListValue();
      this.matchGiftsWithPrizes();
      this.isLoaded.set(true);
    });
  }

  editGift(id: number) {
    this.router.navigate(['/editGift', id]);
  }

  addGiftToBasket(idGift: number, index: number) {
  if (this.prize()) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'הגישה חסומה', 
      detail: 'לא ניתן להוסיף מתנות לסל לאחר שהתבצעה הגרלה.' 
    });
    return;
  }
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: 'עליך להתחבר כדי להוסיף לסל' });
      return;
    }
    const decoded = jwtDecode<MyDecodedToken>(token);
    const userId = Number(decoded.id);
    const addToBasket = async (basketId: number, amountAvailable: number) => {
      const requestedQty = this.listValue()[index];
      const timesToAdd = Math.min(requestedQty, amountAvailable);

      for (let i = 0; i < timesToAdd; i++) {
        const addGift: AddGiftToBasket = { basketId, giftId: idGift };
        await this.basketService.addGiftToBasket(addGift).toPromise();
      }
      if (requestedQty > amountAvailable) {
        this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: `הוספו רק ${amountAvailable} מתנות לסל בהתאם לזמינות` });
      }
      else {
      this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לסל' });
      }
      this.listValue.update(currentArray => {
        const newArray = [...currentArray]; 
        newArray[index] = 1;                
        return newArray;                    
      })
      this.basketService.getBasketByUserId(userId).subscribe(updatedBasket => {
        this.basketService.setBasket(updatedBasket);
      });
    };

    // קריאה לשרת לקבלת נתוני הסל הנוכחיים
    this.basketService.getBasketByUserId(userId).subscribe({
      next: (basket) => {
        this.basket = basket;
        let zoverPackage = 0;
        if (this.basket.packages) {
          this.basket.packages.forEach(p => zoverPackage += p.countCard);
        }
        const currentGiftsCount = this.basket.gifts?.length || 0;
        if (currentGiftsCount < zoverPackage) {
          const availableSlots = zoverPackage - currentGiftsCount;
          const less = this.listValue()[index] - availableSlots;
          if (less > 0) {
            console.log("אתה זקוק לחבילה חדשה בשביל ה" + less + " נוספים");

            this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: `ניתן להוסיף רק ${availableSlots} מתנות נוס בהתאם לחבילות שבסל` });
          }
          addToBasket(this.basket.id, availableSlots);
        }
        else if (zoverPackage > 0 && currentGiftsCount === 0) {
          addToBasket(this.basket.id, zoverPackage);
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: 'יש לבחור חבילה חדשה' });
        }
      },
      error: (err) => {
        if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'יש לבחור תחילה חבילה' });
        } else {
          console.error("שגיאה", err);
          this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'אירעה שגיאה בחיבור לסל' });
        }
      }
    });
  }
  increaseQty(index: number) {
    this.listValue.update(vals => {
      vals[index]++;
      return [...vals];
    });
  }

  decreaseQty(index: number) {
    this.listValue.update(vals => {
      if (vals[index] > 1) vals[index]--;
      return [...vals];
    });
  }
}