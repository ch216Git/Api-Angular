import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { BasketService } from '../../../services/basket-service';
import { GetBasketById, MyDecodedToken, RemoveGiftFromBasket, RemovePackageFromBasket } from '../../../models/basket.model';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../../services/gift-service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OrderServise } from '../../../services/order-servise';
import { CreateOrder } from '../../../models/order.model';
import { Observable, concatMap, take } from 'rxjs';
import { CardModule } from 'primeng/card';
import { GetPackage } from '../../../models/package.model';
import { GetGift } from '../../../models/gift.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basket-component',
  imports: [CommonModule, DialogModule,FormsModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './basket-component.html',
  styleUrl: './basket-component.scss',
})
export class BasketComponent {
  basketService: BasketService = inject(BasketService);
  orderService: OrderServise = inject(OrderServise);
  cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  // basket?: GetBasketById;
  // flag: boolean = false;

  visible: boolean = false;
  basket$ = this.basketService.basket$;
  buyPackageCount: { [id: number]: number } = {};
  packagesWithCount: { package: any; count: number }[] = [];
  buyGiftCount: { [id: number]: number } = {};
  giftsWithCount: { gift: any; count: number }[] = [];

  ngOnInit() {
    this.basket$.subscribe(basket => {
      console.log('BASKET:', basket);
      this.buyPackageCount = {};
      this.packagesWithCount = [];
      this.buyGiftCount = {};
      this.giftsWithCount = [];
      if (!basket?.packages) return;

      basket.packages?.forEach(p => {
        this.buyPackageCount[p.id] = (this.buyPackageCount[p.id] ?? 0) + 1;
      });
      const uniquePackages = new Map<number, GetPackage>();

      basket.packages.forEach(p => {
        if (!uniquePackages.has(p.id)) {
          uniquePackages.set(p.id, p);
        }
      });

      this.packagesWithCount = Array.from(uniquePackages.values()).map(p => ({
        package: p,
        count: this.buyPackageCount[p.id]
      }));
      if (!basket?.gifts) return;

      basket.gifts?.forEach(g => {
        this.buyGiftCount[g.id] = (this.buyGiftCount[g.id] ?? 0) + 1;
      });
      const uniqueGifts = new Map<number, GetGift>();

      basket.gifts.forEach(g => {
        if (!uniqueGifts.has(g.id)) {
          uniqueGifts.set(g.id, g);
        }
      });

      this.giftsWithCount = Array.from(uniqueGifts.values()).map(g => ({
        gift: g,
        count: this.buyGiftCount[g.id]
      }));

      // Force change detection after processing the new basket value
      this.cd.markForCheck();

    });
  }


  showDialog() {
    this.visible = true;
  }

  // getBasketById() {
  //   const token: string | null = localStorage.getItem('token');
  //   if (!token) {
  //     return;
  //   }
  //   const decoded = jwtDecode<MyDecodedToken>(token);
  //   const userId = Number(decoded.id);
  //   this.basketService.getBasketByUserId(userId).subscribe( {
  //     next: basket => {
  //       this.basket = basket;
  //       console.log('Basket loaded', basket);
  //     },
  //       error: err => {
  //         if (err.status === 400) {
  //           // אין סל – זה מצב תקין
  //           console.log('אין סל למשתמש');
  //           this.basket = undefined!;
  //         } else {
  //           console.error('שגיאה אמיתית', err);
  //         }

  //       }
  //   })
  // }
  deletePackageFromBasket(itemId: number) {
    this.basket$.pipe(take(1)).subscribe(basket => {
      if (!basket) return;

      const removePackage = {
        basketId: basket.id,  // <-- כאן הגישה נכונה
        packageId: itemId
      };
      for (let i = 0; i < this.packagesWithCount.length; i++) { }
      this.basketService.removePackageFromBasket(removePackage).subscribe({
        next: () => {
          console.log('Item deleted from basket');
          this.cd.markForCheck();
          // this.getBasketById(); // רענון הסל לאחר מחיקת פריט
        },
        error: err => {
          console.error('Error deleting item from basket', err);
        }
      });
    })

  }
  //  deleteItemFromBasket(itemId: number) {
  //   const token: string | null = localStorage.getItem('token');
  //   if (!token) {
  //     return;
  //   }
  //   const decoded = jwtDecode<MyDecodedToken>(token);
  //   const userId = Number(decoded.id);
  //   this.basketService.getBasketByUserId(userId).subscribe( {
  //     next: basket => {
  //       this.basket = basket;
  //       console.log('Basket loaded', basket);
  //     },
  //   });
  //     this.basketService.removeGiftFromBasket(itemId).subscribe({
  //       next: () => {
  //         console.log('Item deleted from basket');
  //         this.getBasketById(); // רענון הסל לאחר מחיקת פריט
  //       },
  //       error: err => {
  //         console.error('Error deleting item from basket', err);
  //       }
  //     });
  //   }
  saveProfile() {
    this.visible=false
    this.basket$.pipe(take(1)).subscribe(basket => {

      if (!basket) {
        console.error('אין סל פעיל לשמירה');
        return;
      }

      const giftsId = basket.gifts?.map(g => g.id) ?? [];
      const packagesId = basket.packages?.map(p => p.id) ?? [];

      const order = {
        userId: basket.userId,
        giftsId,
        packagesId,
        orderDate: new Date(),
        sum: basket.sum
      };

      this.orderService.createOrder(order).pipe(
        concatMap(() => this.basketService.deleteBasket(basket.id))
      ).subscribe({
        next: () => {
          console.log('Order created and basket deleted safely');
          this.basketService.clearBasket();
        },
        error: err => {
          console.error('Error creating order or deleting basket', err);
        }
      });

    }).unsubscribe();
  }
  // הוספת חבילה (פלוס)
  addPackage(packageId: number) {
    this.basket$.pipe(take(1)).subscribe(basket => {
      if (!basket) return;
      const addData = { basketId: basket.id, packageId: packageId };
      this.basketService.addPackageToBasket(addData).subscribe({
        next: (data) => {
          setTimeout(() => {
            this.basketService.getBasketByUserId(basket.userId).subscribe(updatedBasket => {
              this.basketService.setBasket(updatedBasket);
            });
          }, 200);
        }
      });
    });
  }

  // הורדת חבילה (מינוס)
  removePackage(packageId: number) {
    this.basket$.pipe(take(1)).subscribe(basket => {
      if (!basket) return;
      const removeData = { basketId: basket.id, packageId: packageId };
      let minus=false
      let zoverPackage = 0;
      if (basket.packages) {
        for (let j = 0; j < basket.packages.length; j++) {
          zoverPackage += basket.packages[j].countCard
          if(!minus&&packageId == basket.packages[j].id){
            zoverPackage-=basket.packages[j].countCard
            minus=true
          }
        }
      }
      
      this.basketService.removePackageFromBasket(removeData).subscribe({
        next: (data) => {
          if(basket.gifts)
          if(basket.gifts?.length>zoverPackage){
            const deleteGift=basket.gifts?.length-zoverPackage;
          }
          setTimeout(() => {
            this.basketService.getBasketByUserId(basket.userId).subscribe(updatedBasket => {
              this.basketService.setBasket(updatedBasket);
            });
          }, 200);
        }
      });
    });
  }

  // הוספת מתנה (פלוס)
  addGift(giftId: number) {

    this.basket$.pipe(take(1)).subscribe(basket => {
      if (!basket) return;
      let zoverPackage = 0;
      if (basket.packages) {
        for (let j = 0; j < basket.packages.length; j++) {
          zoverPackage += basket.packages[j].countCard
        }
      }
      let have = false;
      if (basket.gifts)
        if (zoverPackage > basket.gifts?.length && zoverPackage > 0)
          have = true;
      if (!basket.gifts && zoverPackage > 0)
        have = true;
      if (have) {
        const addData = { basketId: basket.id, giftId: giftId };
        this.basketService.addGiftToBasket(addData).subscribe({
          next: (data) => {
            setTimeout(() => {
              this.basketService.getBasketByUserId(basket.userId).subscribe(updatedBasket => {
                this.basketService.setBasket(updatedBasket);
              });
            }, 200);
          }

        });
      }
      else {
        console.log("יש להוסיף חבילה");

      }
    });
  }

  // הורדת מתנה (מינוס)
  removeGift(giftId: number) {
    this.basket$.pipe(take(1)).subscribe(basket => {
      if (!basket) return;
      const removeData = { basketId: basket.id, giftId: giftId };
      this.basketService.removeGiftFromBasket(removeData).subscribe({
         next: (data) => {
          setTimeout(() => {
            this.basketService.getBasketByUserId(basket.userId).subscribe(updatedBasket => {
              this.basketService.setBasket(updatedBasket);
            });
          }, 200);
        }
      }
      );
    });
  }

  // saveProfile() {
  //   // this.getBasketById();
  //   if (!this.basket) {
  //     console.error('אין סל פעיל לשמירה');
  //     return;
  //   }
  // const giftsId: number[] = this.basket.gifts?.map(g => g.id) ?? [];
  // const packagesId: number[] = this.basket.packages?.map(p => p.id) ?? [];

  // const order = {
  //   userId: this.basket.userId,
  //   giftsId: giftsId,
  //   packagesId: packagesId,
  //   orderDate: new Date(),
  //   sum: this.basket.sum
  // };

  // this.orderService.createOrder(order).pipe(
  //   concatMap(() => this.basketService.deleteBasket(this.basket!.id))
  // ).subscribe({
  //   next: () => {
  //     console.log('Order created and basket deleted safely');
  //     this.basketService.clearBasket(); // עדכון כל הקומפוננטות
  //   },
  //   error: err => {
  //     console.error('Error creating order or deleting basket', err);
  //   }
  // });
  //   }
  // saveProfile() {
  //   this.getBasketByIdAsync().subscribe({
  //     next: basket => {
  //       this.basket = basket; // מוודא שהbasket מעודכן
  //       if (!this.basket) {
  //         console.error('אין סל פעיל לשמירה');
  //         return;
  //       }

  //       const giftsId: number[] = this.basket.gifts?.map(g => g.id) ?? [];
  //       const packagesId: number[] = this.basket.packages?.map(p => p.id) ?? [];

  //       const order = {
  //         userId: this.basket.userId,
  //         giftsId: giftsId,
  //         packagesId: packagesId,
  //         orderDate: new Date(),
  //         sum: this.basket.sum
  //       };

  //       this.orderService.createOrder(order).subscribe({
  //         next: () => {
  //           console.log('Order created successfully');
  //         },
  //         error: err => {
  //           console.error('Error creating order', err);
  //         }
  //       });

  //       this.basketService.deleteBasket(this.basket.id).subscribe({
  //         next: () => {
  //           console.log('Basket deleted successfully');
  //           this.getBasketById(); // רענון הסל לאחר מחיקה
  //         },
  //         error: err => {
  //           console.error('Error deleting basket', err);
  //         }
  //       });
  //     },
  //     error: err => {
  //       console.error('Error loading basket', err);
  //     }
  //   });
  // }

  // // צריך גם גרסה של getBasketById שמחזירה Observable
  // getBasketByIdAsync(): Observable<GetBasketById | undefined> {
  //   const token: string | null = localStorage.getItem('token');
  //   if (!token) {
  //     return new Observable(sub => sub.next(undefined));
  //   }
  //   const decoded = jwtDecode<MyDecodedToken>(token);
  //   const userId = Number(decoded.id);
  //   return this.basketService.getBasketByUserId(userId);
  // }

}

