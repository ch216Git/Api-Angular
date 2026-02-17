import { Component, inject, computed, signal } from '@angular/core';
import { BasketService } from '../../../services/basket-service';
import { GetBasketById } from '../../../models/basket.model';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OrderServise } from '../../../services/order-servise';
import { concatMap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GetPackage } from '../../../models/package.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-basket-component',
  standalone: true,
  imports: [ConfirmDialogModule,ToastModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, CardModule],
  providers: [ConfirmationService,MessageService],
  templateUrl: './basket-component.html',
  styleUrl: './basket-component.scss',
})
export class BasketComponent {
   basketService:BasketService = inject(BasketService);
   orderService:OrderServise = inject(OrderServise);
   messageService:MessageService = inject(MessageService);
   confirmationService = inject(ConfirmationService);
  // חשיפת הסיגנל מהסרוויס
  basket = this.basketService.basket;
  visible:boolean = false;
  delete:boolean=false;

  // חישוב אוטומטי של חבילות עם כמות
  packagesWithCount = computed(() => {
    const b = this.basket();
    if (!b || !b.packages) return [];
    
    const counts = new Map<number, { package: GetPackage, count: number }>();
    b.packages.forEach(p => {
      const existing = counts.get(p.id);
      if (existing) {
        existing.count++;
      } else {
        counts.set(p.id, { package: p, count: 1 });
      }
    });
    return Array.from(counts.values());
  });

  // חישוב אוטומטי של מתנות עם כמות
  giftsWithCount = computed(() => {
    const b = this.basket();
    if (!b || !b.gifts) return [];

    const counts = new Map<number, { gift: any, count: number }>();
    b.gifts.forEach(g => {
      const existing = counts.get(g.id);
      if (existing) {
        existing.count++;
      } else {
        counts.set(g.id, { gift: g, count: 1 });
      }
    });
    return Array.from(counts.values());
  });

  showDialog() {
    this.visible = true;
  }

  saveProfile() {
    const currentBasket = this.basket();
    if (!currentBasket) return;

    this.visible = false;

    const order = {
      userId: currentBasket.userId,
      giftsId: currentBasket.gifts?.map(g => g.id) ?? [],
      packagesId: currentBasket.packages?.map(p => p.id) ?? [],
      orderDate: new Date(),
      sum: currentBasket.sum
    };

    this.orderService.createOrder(order).pipe(
      concatMap(() => this.basketService.deleteBasket(currentBasket.id))
    ).subscribe({
      next: () => {
        this.basketService.clearBasket();
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הזמנה בוצעה בהצלחה!' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'ההזמנה לא בוצעה!' });
      }
    });
  }

  // פונקציות ניהול סל - מעדכנות את הסיגנל בסרוויס ישירות מהתשובה
  addPackage(packageId: number) {
    const b = this.basket();
    if (!b) return;
    this.basketService.addPackageToBasket({ basketId: b.id, packageId }).subscribe(updated => {
      this.basketService.setBasket(updated);
    });
  }

  removePackage(packageId: number) {
  const b = this.basket();
  if (!b) return;

  const countGift = b.gifts?.length || 0;
  const packages = this.packagesWithCount();
  const packageItem = packages.find(p => p.package.id === packageId);
  const countPackage = packageItem?.count || 0;
  const countCardInPackage = packageItem?.package.countCard || 0;

  // בדיקה האם הסרת החבילה תגרום לחריגה בכמות המתנות המותרות
  if (countGift > (this.getTotalAllowedGifts() - countCardInPackage)) {
    // אם כן - מבקשים אישור
    this.confirmationService.confirm({
      message: 'מחיקת החבילה תגרום להסרת מתנות. האם להמשיך?',
      header: 'האם אתה בטוח?', 
      accept: () => {
        this.executePackageRemoval(b.id, packageId);
      }
    });
  } else {
    // אם אין חריגה, מוחקים ישר
    this.executePackageRemoval(b.id, packageId);
  }
}
  executePackageRemoval(basketId: number, packageId: number) {
  this.basketService.removePackageFromBasket({ basketId, packageId }).subscribe(updated => {
    this.basketService.setBasket(updated);
    this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'החבילה הוסרה' });
  });
}


// פונקציית עזר לחישוב סך המתנות המותרות כרגע בסל
getTotalAllowedGifts(): number {
  return this.basket()?.packages?.reduce((sum, p) => sum + (p.countCard || 0), 0) || 0;
}

removeAllPackage(packageId: number) {
  const b = this.basket();
  if (!b) return;

  const countGift = b.gifts?.length || 0;
  const packages = this.packagesWithCount();
  const packageItem = packages.find(p => p.package.id === packageId);
  
  if (!packageItem) return;

  // חישוב כמה "זכויות למתנות" יאבדו אם נמחק את כל החבילות מהסוג הזה
  const totalCardsToRemove = packageItem.count * (packageItem.package.countCard || 0);
  const remainingAllowedGifts = this.getTotalAllowedGifts() - totalCardsToRemove;

  // אם לאחר המחיקה יהיו יותר מתנות ממה שמותר
  if (countGift > remainingAllowedGifts) {
    this.confirmationService.confirm({
      message: 'מחיקת כל החבילות מסוג זה תגרום להסרת מתנות. האם להמשיך?',
      header: 'האם אתה בטוח?', // מתאים לכותרת שבתמונה
      accept: () => {
        this.executeAllPackagesRemoval(b.id, packageId);
      }
    });
  } else {
    // אם אין חריגה, מוחקים ישר
    this.executeAllPackagesRemoval(b.id, packageId);
  }
}

// פונקציית עזר לביצוע המחיקה הכוללת מול השרת
executeAllPackagesRemoval(basketId: number, packageId: number) {
  this.basketService.removeAllPackagesFromBasket({ basketId, packageId }).subscribe(updated => {
    this.basketService.setBasket(updated);
    this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'כל החבילות מהסוג נמחקו' });
  });
}

  addGift(giftId: number) {
    const b = this.basket();
    if (!b) return;

    const zoverPackage = b.packages?.reduce((sum, p) => sum + (p.countCard || 0), 0) || 0;
    const currentGiftsCount = b.gifts?.length || 0;

    if (zoverPackage > currentGiftsCount) {
      this.basketService.addGiftToBasket({ basketId: b.id, giftId }).subscribe(updated => {
        this.basketService.setBasket(updated);
      });
    } else {
      console.warn("יש להוסיף חבילה המאפשרת בחירת מתנות נוספות");
    }
  }

  removeGift(giftId: number) {
    const b = this.basket();
    if (!b) return;
    this.basketService.removeGiftFromBasket({ basketId: b.id, giftId }).subscribe(updated => {
      this.basketService.setBasket(updated);
    });
  }

  removeAllGift(giftId: number) {
    const b = this.basket();
    if (!b) return;
    this.basketService.removeAllGiftsFromBasket({ basketId: b.id, giftId }).subscribe(updated => {
      this.basketService.setBasket(updated);
    });
  }
// confirmDeletion(basketId: number, packageId: number) {
//   this.confirmationService.confirm({
//     message: 'הסרת החבילה תגרום להסרת מתנות עודפות מהסל. האם להמשיך?',
//     header: 'אישור הסרת חבילה',
//     icon: 'pi pi-exclamation-triangle',
//     acceptLabel: 'כן, הסר',
//     rejectLabel: 'ביטול',
//     accept: () => {
//       // המחיקה מתבצעת רק כאן!
//       this.executePackageRemoval(basketId, packageId);
//     }
//   });
// }

// פונקציה שמבצעת את הקריאה לשרת בפועל
// executePackageRemoval(basketId: number, packageId: number) {
//   this.basketService.removePackageFromBasket({ basketId, packageId }).subscribe(updated => {
//     this.basketService.setBasket(updated);
//     this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'החבילה הוסרה' });
//   });
// }
}