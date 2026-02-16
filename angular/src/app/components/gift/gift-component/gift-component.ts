import { GiftService } from '../../../services/gift-service';
import { Component, OnInit, ViewChild, inject, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftWithWinner } from '../../../models/gift.model';
import { AddGiftComponent } from '../add-gift-component/add-gift-component';
import { RouterModule, Router } from '@angular/router';
import { BasketService } from '../../../services/basket-service';
import { AddGiftToBasket, GetBasketById, MyDecodedToken } from '../../../models/basket.model';
import { jwtDecode } from 'jwt-decode';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber'; // עודכן שם הרכיב
import { GetCategory, GetCategoryById } from '../../../models/category.model';
import { CategoryService } from '../../../services/category-service';
import { OrderComponent } from '../../order-component/order-component';
import { PrizeService } from '../../../services/prize-service';
import { GetPrize } from '../../../models/prize.model';
import { UserService } from '../../../services/userService';
import { ToastModule } from 'primeng/toast'; // <-- ייבוא ToastModule
import { MessageService } from 'primeng/api'; // <-- ייבוא MessageService

@Component({
  selector: 'app-gift-component',
  standalone: true, // בהנחה שזה רכיב עצמאי
  imports: [
    CommonModule,
    AddGiftComponent,
    RouterModule,
    CardModule,
    FormsModule,
    InputNumberModule,
    OrderComponent,
    ToastModule // <-- הוספת ToastModule ל-imports
  ],
  templateUrl: './gift-component.html',
  styleUrl: './gift-component.scss',
  providers: [MessageService] // <-- הוספת MessageService כ-provider
})
export class GiftComponent implements OnInit {

  constructor(private router: Router) { }
  
  // הזרקת ה-Services
  messageService: MessageService = inject(MessageService); // <-- הזרקת MessageService
  giftService: GiftService = inject(GiftService);
  basketService: BasketService = inject(BasketService);
  prizeService: PrizeService = inject(PrizeService);
  userService: UserService = inject(UserService);
  categoryService: CategoryService = inject(CategoryService);
  cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  listGifts: GiftWithWinner[] = [];
  listValue: number[] = [];
  basket!: GetBasketById;
  listCategory: GetCategory[] = [];
  listCategoryWithGifts: GetCategoryById[] = [];
  isLoaded = false;
  prize: boolean = false;
  listPrize: GetPrize[] = [];
  selectedValue = signal('');
  selectedSearcheValue = signal('searchByGiftName');
  nameSignal = signal('');
  originalGifts: GiftWithWinner[] = [];

  ngOnInit() {
    this.getAllGifts();
    this.getAllCategory();
    this.prizeService.getAllPrizes().subscribe(prizes => {
      this.listPrize = prizes;
      if (this.listPrize.length > 0)
        this.prize = true;
      this.listGifts.forEach(gift => {
        const prize = prizes.find(p => p.giftId === gift.id);

        if (!prize) {
          gift['winner'] = null;
          return;
        }

        this.userService.getUserById(prize.userId).subscribe(user => {
          gift['winner'] = user;
        });
      });
    });
  }

  onSearchTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSearcheValue.set(select.value);
  }

  searchEffect = effect(() => {
    const searchText = this.nameSignal().trim();
    const filterType = this.selectedSearcheValue();

    if (!searchText) {
      this.listGifts = [...this.originalGifts];
      this.syncListValue();
      this.matchGiftsWithPrizes();
      this.cd.markForCheck();
      return;
    }

    let searchObservable;

    if (filterType === 'searchByGiftName') {
      searchObservable = this.giftService.exsistsGiftName(searchText);
    } else if (filterType === 'searchByDonorName') {
      searchObservable = this.giftService.existsDonorName(searchText);
    } else if (filterType === 'searchByCustomer') {
      const num = Number(searchText);
      if (isNaN(num)) {
        this.listGifts = [];
        return;
      }
      searchObservable = this.giftService.existsSumCoustomerGift(num);
    }

    searchObservable?.subscribe({
      next: data => {
        this.listGifts = data ?? [];
        this.syncListValue();
        this.matchGiftsWithPrizes();
        this.cd.markForCheck();
      },
      error: err => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בביצוע החיפוש' });
        this.listGifts = [];
        this.syncListValue();
        this.matchGiftsWithPrizes();
        this.cd.markForCheck();
      }
    });
  });

  onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedValue.set(select.value);
    this.runAction();
  }

  runAction() {
    if (this.selectedValue() === 'sortByPrice') {
      this.giftService.sortGiftsByPrice().subscribe(data => {
        this.listGifts = data;
        this.syncListValue();
        this.matchGiftsWithPrizes();
        this.cd.markForCheck();
      });
    }
    else if (this.selectedValue() === 'sortByBuyer') {
      this.giftService.sortGiftsByBuyer().subscribe(data => {
        this.listGifts = data;
        this.syncListValue();
        this.matchGiftsWithPrizes();
        this.cd.markForCheck();
      });
    }
    else if (this.selectedValue() === 'noSort') {
      this.getAllGifts();
    }
  }

  private syncListValue() {
    this.listValue = this.listGifts.map(() => 1);
  }

  private matchGiftsWithPrizes() {
    this.listGifts.forEach(gift => {
      const prize = this.listPrize.find(p => p.giftId === gift.id);

      if (!prize) {
        gift['winner'] = null;
        return;
      }

      this.userService.getUserById(prize.userId).subscribe(user => {
        gift['winner'] = user;
        this.cd.detectChanges();
      });
    });
  }

  getAllCategory() {
    this.listCategory = [];
    this.listCategoryWithGifts = [];
    this.categoryService.getAllCategory().subscribe(data => {
      this.listCategory = data;
      for (let i = 0; i < this.listCategory.length; i++) {
        this.categoryService.getCategoryById(this.listCategory[i].id).subscribe(c => {
          this.listCategoryWithGifts.push(c);
          this.cd.markForCheck();
        });
      }
    });
  }

  deleteGift(id: number) {
<<<<<<< HEAD
 
  this.giftService.deleteGift(id).subscribe({
    next: () => {
      // הצלחה: המתנה לא הייתה בסל/הזמנה ונמחקה בשרת
      this.listGifts = this.listGifts.filter(g => g.id !== id);
      this.cd.markForCheck();
      console.log("המתנה נמחקה בהצלחה.");
    },
    error: err => {
      console.error("Error deleting gift", err);
     const errorMessage = typeof err.error === 'string' 
        ? err.error 
        : "לא ניתן למחוק מתנה שנמצאת בסל קניות או בהזמנה של לקוח.";
      
      console.log(errorMessage);
    }
  });
}
  // deleteGift(id: number) {
  //   this.giftService.deleteGift(id).subscribe({
  //     next: () => {
  //       this.listGifts = this.listGifts.filter(g => g.id !== id);
  //       this.cd.markForCheck();   
  //     },
  //     error: err => {
  //       console.error("Error deleting gift", err);
  //     }
  //   });
  // }
=======
    this.giftService.deleteGift(id).subscribe({
      next: () => {
        this.listGifts = this.listGifts.filter(g => g.id !== id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נמחקה בהצלחה' });
        this.cd.markForCheck();
      },
      error: err => {
        console.error("Error deleting gift", err);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה למחוק את המתנה' });
      }
    });
  }

>>>>>>> a679d6d8682623594d6157629ff4c2c8f386654b
  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.listCategoryWithGifts = this.listCategoryWithGifts.filter(c => c.id !== id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הקטגוריה נמחקה' });
        this.cd.markForCheck();
      },
      error: err => {
        console.error("Error deleting category", err);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה למחוק את הקטגוריה' });
      }
    });
  }

  getCategoryById(id: number) {
    this.isLoaded = false;
    this.categoryService.getCategoryById(id).subscribe(data => {
      this.listGifts = data.gifts ?? [];
      this.syncListValue();
      this.matchGiftsWithPrizes();
      this.isLoaded = true;
      this.cd.markForCheck();
    });
  }

  getAllGifts() {
    this.isLoaded = false;
    this.giftService.getAllGift().subscribe(data => {
      this.originalGifts = data;
      this.listGifts = [...this.originalGifts];
      this.syncListValue();
      this.matchGiftsWithPrizes();
      this.isLoaded = true;
      this.cd.markForCheck();
    });
  }

  editGift(id: number) {
    this.router.navigate(['/editGift', id]);
  }

  addGiftToBasket(idGift: number, index: number) {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: 'עליך להתחבר כדי להוסיף לסל' });
      return;
    }

    const decoded = jwtDecode<MyDecodedToken>(token);
    const userId = Number(decoded.id);

    const addToBasket = async (basketId: number, amountGiven: number) => {
      const timesToAdd = Math.min(this.listValue[index], amountGiven);
      for (let i = 0; i < timesToAdd; i++) {
        const addGift: AddGiftToBasket = { basketId, giftId: idGift };
        await this.basketService.addGiftToBasket(addGift).toPromise();
      }
      
      this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לסל' });

      this.basketService.getBasketByUserId(userId).subscribe(updatedBasket => {
        this.basketService.setBasket(updatedBasket);
      });
    };

    this.basketService.getBasketByUserId(userId).subscribe({
      next: basket => {
        this.basket = basket;
        let zoverPackage = 0;
        if (this.basket.packages) {
          for (let j = 0; j < this.basket.packages.length; j++) {
            zoverPackage += this.basket.packages[j].countCard;
          }
        }
        if (this.basket.gifts) {
          if (this.basket.gifts?.length < zoverPackage) {
            const count = zoverPackage - this.basket.gifts.length;
            addToBasket(this.basket.id, count);
          }
          else if (zoverPackage > 0 && this.basket.gifts?.length === 0)
            addToBasket(this.basket.id, zoverPackage);
          else {
            this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: 'יש לבחור חבילה חדשה' });
          }
        }
      },
      error: err => {
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
    this.listValue[index]++;
  }

  decreaseQty(index: number) {
    if (this.listValue[index] > 1) {
      this.listValue[index]--;
    }
  }
}