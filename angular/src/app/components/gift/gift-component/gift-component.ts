import { GiftService } from '../../../services/gift-service';
import { Component, OnInit, ViewChild, inject, input, output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetGift, GiftWithWinner } from '../../../models/gift.model';
import { AddGiftComponent } from '../add-gift-component/add-gift-component';
import { RouterModule, Router } from '@angular/router';
import { BasketService } from '../../../services/basket-service';
import { AddGiftToBasket, GetBasketById, MyDecodedToken } from '../../../models/basket.model';
import { jwtDecode } from 'jwt-decode';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { GetCategory, GetCategoryById } from '../../../models/category.model';
import { CategoryService } from '../../../services/category-service';
import { list } from '@primeng/themes/aura/autocomplete';
import { OrderComponent } from '../../order-component/order-component';
import { PrizeService } from '../../../services/prize-service';
import { GetPrize } from '../../../models/prize.model';
import { UserService } from '../../../services/userService';



@Component({
  selector: 'app-gift-component',
  imports: [CommonModule, AddGiftComponent, RouterModule, CardModule, FormsModule, InputNumber,OrderComponent],
  templateUrl: './gift-component.html',
  styleUrl: './gift-component.scss',
})
export class GiftComponent {

  constructor(private router: Router) { }
  giftService: GiftService = inject(GiftService);
  basketService: BasketService = inject(BasketService)
  prizeService: PrizeService = inject(PrizeService)
  userService: UserService = inject(UserService)
  cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  listGifts: GiftWithWinner[] = [];
  listValue: number[] = []
  basket!: GetBasketById;
  categoryService: CategoryService = inject(CategoryService);
  listCategory: GetCategory[] = [];
  listCategoryWithGifts: GetCategoryById[] = [];
  isLoaded = false;
  prize:boolean=false;
  listPrize:GetPrize[]=[];
  // combinedList: any[] = [];

  // selectedGift: GetGift | undefined;
  // showUpdate:boolean=false;

  ngOnInit() {
    this.getAllGifts()
    this.getAllCategory();
    this.prizeService.getAllPrizes().subscribe(prizes => {
      this.listPrize=prizes;
      if(this.listPrize.length>0)
        this.prize=true;
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

}
);

  }
//  matchAllData() {
//   this.combinedList = [];

//   this.listPrize.forEach(prize => {

//     const user = this.listUser.find(u => u.id === prize.userId);
//     const gift = this.listGifts.find(g => g.id === prize.giftId);

//     this.combinedList.push({
//       userName: user ? user : 'משתמש לא ידוע',
//       giftName: gift ? gift.id : 'מתנה לא ידועה'
//     });
//   })}
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
    this.listCategory=[];
    this.listCategoryWithGifts=[];
    this.categoryService.getAllCategory().subscribe(data => {
      this.listCategory = data;
      // console.log(this.listCategory.length + "length");
      for (let i = 0; i < this.listCategory.length; i++) {
        // console.log(i);

        this.categoryService.getCategoryById(this.listCategory[i].id).subscribe(c => {
          // console.log(c);

          this.listCategoryWithGifts.push(c);
          this.cd.markForCheck();
          // console.log(this.listCategoryWithGifts.length + "length in");

        })
      }
    });
  }
  deleteGift(id: number) {
    this.giftService.deleteGift(id).subscribe({
      next: () => {
        this.listGifts = this.listGifts.filter(g => g.id !== id);
        this.cd.markForCheck();   
      },
      error: err => {
        console.error("Error deleting gift", err);
      }
    });
  }
  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        // console.log("deleteCategory");
        // מחיקת הקטגוריה מהמערך המקומי כדי לרנדר מחדש את המסך
        this.listCategoryWithGifts = this.listCategoryWithGifts.filter(c => c.id !== id);
        this.cd.markForCheck();
        // this.getAllCategory();
      },
      error: err => {
        console.error("Error deleting category", err);
      }
    });
  }

  getCategoryById(id: number) {
    this.isLoaded = false;

    this.categoryService.getCategoryById(id).subscribe(data => {
      this.listGifts = data.gifts ?? [];
      console.log('Gifts by category loaded:');
      console.log(this.listGifts);
      this.syncListValue();
      this.matchGiftsWithPrizes();
      this.isLoaded = true;
      this.cd.markForCheck();
    });
  }

  getAllGifts() {
    this.isLoaded = false;

    this.giftService.getAllGift().subscribe(data => {
      this.listGifts = data;
      console.log('Gifts loaded:');

      console.log(this.listGifts);

      this.syncListValue();
      this.matchGiftsWithPrizes();
      this.isLoaded = true;
      this.cd.markForCheck();
    });
  }

  editGift(id: number) {
    this.router.navigate(['/editGift', id]);
    // this.selectedGift= this.listGifts.find(gift=>gift.id===id);
    // this.showUpdate=true;
    // this.updateGift.gift = {} as GetGift;
    // this.updateGift.gift= this.listGifts.find(gift=>gift.id===id);
    // console.log(this.updateGift.gift);
    // this.updateGift?.do();
  }

  addGiftToBasket(idGift: number, index: number) {
    const token: string | null = localStorage.getItem('token')
    if (!token) {
      console.log("אתה צריך להתחבר");
      return;
    }

    const decoded = jwtDecode<MyDecodedToken>(token);
    const userId = Number(decoded.id);

    const addToBasket = async (basketId: number, amountGiven: number) => {
      const timesToAdd = Math.min(this.listValue[index], amountGiven);
      for (let i = 0; i < timesToAdd; i++) {
        const addGift: AddGiftToBasket = { basketId, giftId: idGift };
        await this.basketService.addGiftToBasket(addGift).toPromise();
        console.log(`הצלחה #${i + 1}`);
        if (this.listValue[index] > amountGiven) {
          const need = this.listValue[index] - amountGiven
          console.log("יש לבחור חבילה חדשה בשביל  " + need + " הנוספים");
        }

      }
      // אחרי כל ההוספות, עדכן את הסל
      this.basketService.getBasketByUserId(userId).subscribe(updatedBasket => {
        this.basketService.setBasket(updatedBasket);

      });
    }


    this.basketService.getBasketByUserId(userId).subscribe({
      next: basket => {
        this.basket = basket;
        let zoverPackage = 0;
        if (this.basket.packages) {
          for (let j = 0; j < this.basket.packages.length; j++) {
            zoverPackage += this.basket.packages[j].countCard
          }
        }
        if (this.basket.gifts) {
          console.log("this.basket.gifts?.length" + this.basket.gifts?.length);
          console.log("zoverPackage" + zoverPackage);

          if (this.basket.gifts?.length < zoverPackage) {
            const count = zoverPackage - this.basket.gifts.length
            addToBasket(this.basket.id, count);
          }
          else if (zoverPackage > 0 && this.basket.gifts?.length === 0)
            addToBasket(this.basket.id, zoverPackage)
          else {
            console.log("יש לבחור חבילה חדשה");
          }
        }

      },
      error: err => {
        if (err.status === 400) {
          console.log("יש לבחור תחילה חבילה")

        } else {
          console.error("שגיאה", err);
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
