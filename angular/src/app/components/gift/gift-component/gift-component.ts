import { GiftService } from '../../../services/gift-service';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftWithWinner } from '../../../models/gift.model';
import { RouterModule, Router } from '@angular/router';
import { BasketService } from '../../../services/basket-service';
import { AddGiftToBasket, MyDecodedToken } from '../../../models/basket.model';
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
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    FormsModule,
    InputNumberModule,
    ToastModule 
  ],
  templateUrl: './gift-component.html',
  styleUrl: './gift-component.scss',
  providers: [MessageService] 
})
export class GiftComponent implements OnInit {
  private router = inject(Router);
  private messageService = inject(MessageService);
  private giftService = inject(GiftService);
  private basketService = inject(BasketService);
  private prizeService = inject(PrizeService);
  private userService = inject(UserService);
  private categoryService = inject(CategoryService);

  // --- Signals (נתוני בסיס) ---
  allGifts = signal<GiftWithWinner[]>([]); 
  listCategoryWithGifts = signal<GetCategoryById[]>([]);
  listPrize = signal<GetPrize[]>([]);
  
  // --- Signals (מצב תצוגה) ---
  selectedCategoryId = signal<number | null>(null);
  nameSearch = signal('');
  selectedSearchType = signal('searchByGiftName');
  selectedSortValue = signal('noSort');
  role = signal('');
  isLoaded = signal(false);

  // --- Computed (הלוגיקה המרכזית) ---
  // מחשב את רשימת המתנות הסופית לפי סינון קטגוריה וחיפוש טקסטואלי
  filteredGifts = computed(() => {
    let gifts = [...this.allGifts()];

    // 1. סינון לפי קטגוריה
    if (this.selectedCategoryId() !== null) {
      const cat = this.listCategoryWithGifts().find(c => c.id === this.selectedCategoryId());
      if (cat && cat.gifts) {
        gifts = cat.gifts as GiftWithWinner[];
      }
    }

    // 2. סינון לפי חיפוש טקסטואלי (צד לקוח)
    const search = this.nameSearch().toLowerCase().trim();
    if (search) {
      const type = this.selectedSearchType();
      if (type === 'searchByGiftName') {
        gifts = gifts.filter(g => g.name.toLowerCase().includes(search));
      } else if (type === 'searchByDonorName') {
        gifts = gifts.filter(g => (g as any).donor?.name?.toLowerCase().includes(search) || (g as any).donorName?.toLowerCase().includes(search));
      }
      // הערה: חיפוש לפי מספר רוכשים מתבצע מול השרת בפונקציה ייעודית (ראי למטה)
    }

    return gifts;
  });

  // ניהול כמויות לפי מפתח ID של מתנה
  quantities = signal<Record<number, number>>({});

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<MyDecodedToken>(token);
      this.role.set(decoded.role);
    }
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoaded.set(false);
    this.giftService.getAllGift().subscribe(data => {
      this.allGifts.set(data);
      const qtys: Record<number, number> = {};
      data.forEach(g => qtys[g.id] = 1);
      this.quantities.set(qtys);
      this.isLoaded.set(true);
      this.loadWinners();
    });

    this.categoryService.getAllCategory().subscribe(categories => {
      categories.forEach(cat => {
        this.categoryService.getCategoryById(cat.id).subscribe(fullCat => {
          this.listCategoryWithGifts.update(prev => [...prev, fullCat]);
        });
      });
    });

    this.prizeService.getAllPrizes().subscribe(prizes => {
      this.listPrize.set(prizes);
      this.loadWinners();
    });
  }

  loadWinners() {
    const prizes = this.listPrize();
    const gifts = this.allGifts();
    gifts.forEach(gift => {
      const p = prizes.find(prize => prize.giftId === gift.id);
      if (p && !gift.winner) {
        this.userService.getUserById(p.userId).subscribe(user => {
          gift.winner = user;
          this.allGifts.set([...gifts]);
        });
      }
    });
  }

  // --- פונקציות חיפוש מול שרת ---
  onSearchInput(event: any) {
    const val = event.target.value;
    this.nameSearch.set(val);
    
    // אם החיפוש הוא לפי מספר רוכשים, אנחנו צריכים לפנות לשרת
    if (this.selectedSearchType() === 'searchByCustomer' && val.trim() !== '') {
      const num = Number(val);
      if (!isNaN(num)) {
        this.giftService.existsSumCoustomerGift(num).subscribe(data => {
          this.allGifts.set(data || []);
        });
      }
    } else if (val.trim() === '') {
       // אם המשתמש מחק את החיפוש, נטען מחדש הכל
       this.giftService.getAllGift().subscribe(data => this.allGifts.set(data));
    }
  }

  // --- פונקציות מיון ---
  onSortChange(event: any) {
    const val = event.target.value;
    this.selectedSortValue.set(val);

    if (val === 'sortByPrice') {
      this.giftService.sortGiftsByPrice().subscribe(data => this.allGifts.set(data));
    } else if (val === 'sortByBuyer') {
      this.giftService.sortGiftsByBuyer().subscribe(data => this.allGifts.set(data));
    } else {
      this.giftService.getAllGift().subscribe(data => this.allGifts.set(data));
    }
  }

  getCategoryById(id: number) {
    this.selectedCategoryId.set(id);
  }

  getAllGifts() {
    this.selectedCategoryId.set(null);
    this.nameSearch.set('');
  }

  increaseQty(giftId: number) {
    this.quantities.update(q => ({ ...q, [giftId]: (q[giftId] || 1) + 1 }));
  }

  decreaseQty(giftId: number) {
    this.quantities.update(q => ({ ...q, [giftId]: Math.max(1, (q[giftId] || 1) - 1) }));
  }

  async addGiftToBasket(idGift: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.add({ severity: 'warn', detail: 'עליך להתחבר' });
      return;
    }
    const userId = Number(jwtDecode<MyDecodedToken>(token).id);

    this.basketService.getBasketByUserId(userId).subscribe({
      next: async (basket) => {
        const zoverPackage = basket.packages?.reduce((sum, p) => sum + p.countCard, 0) || 0;
        const currentGiftsCount = basket.gifts?.length || 0;
        const qty = this.quantities()[idGift] || 1;

        if (zoverPackage > currentGiftsCount) {
          const canAdd = Math.min(qty, zoverPackage - currentGiftsCount);
          for (let i = 0; i < canAdd; i++) {
            await this.basketService.addGiftToBasket({ basketId: basket.id, giftId: idGift }).toPromise();
          }
          this.messageService.add({ severity: 'success', detail: 'נוסף לסל' });
          this.basketService.loadBasketFromServer(userId);
        } else {
          this.messageService.add({ severity: 'warn', detail: 'אין יתרה בחבילה' });
        }
      }
    });
  }

  deleteGift(id: number) {
    this.giftService.deleteGift(id).subscribe(() => {
      this.allGifts.update(list => list.filter(g => g.id !== id));
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.listCategoryWithGifts.update(list => list.filter(c => c.id !== id));
    });
  }

  editGift(id: number) {
    this.router.navigate(['/editGift', id]);
  }
}