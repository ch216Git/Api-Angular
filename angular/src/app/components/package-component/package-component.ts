import { Component, inject, OnInit, signal } from '@angular/core';
import { PackageService } from '../../services/package-service';
import { PackageVM } from '../../models/package.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { BasketService } from '../../services/basket-service';
import { AddPackageToBasket, CreateBasket, GetBasketById, MyDecodedToken } from '../../models/basket.model';
import { jwtDecode } from 'jwt-decode';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PrizeService } from '../../services/prize-service';

@Component({
  selector: 'app-package-component',
  standalone: true,
  imports: [CommonModule, CardModule, FormsModule, InputNumber, ToastModule],
  templateUrl: './package-component.html',
  styleUrl: './package-component.scss',
  providers: [MessageService]
})
export class PackageComponent implements OnInit {
  // הזרקות
  prizeService:PrizeService = inject(PrizeService);
  packageService: PackageService = inject(PackageService);
  basketService: BasketService = inject(BasketService);
  private messageService = inject(MessageService);


  // --- Signals ---
  listPackages = signal<PackageVM[]>([]);
  listValue = signal<number[]>([]); // המערך של המונים כסיגנל

  // משתנים רגילים
  basket!: GetBasketById;
  listColors: string[] = ['altColorsCart_10', 'altColorsCart_3', 'altColorsCart_1', 'altColorsCart_30', 'altColorsCart_500', 'altColorsCart_300', 'altColorsCart_100'];

  ngOnInit() {
    this.getAllPackages();
  }

  getAllPackages() {
    this.packageService.getAllPackage().subscribe({
      next: (data) => {
        const packages = data.map((p, index) => ({
          ...p,
          imageUrl: `https://localhost:7081/uploads/gift${index}.png`
        }));
        this.listPackages.set(packages);
        // אתחול מערך המונים ב-1 לפי כמות החבילות
        this.listValue.set(new Array(packages.length).fill(1));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן לטעון את החבילות' });
      }
    });
  }

  addPackage(idPackage: number, index: number) {
    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => {
        if (prizes && prizes.length > 0) {
          this.messageService.add({ severity: 'warn', summary: 'המכירה הסתיימה', detail: 'לא ניתן להוסיף פריטים' });
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          this.messageService.add({ severity: 'info', summary: 'התחברות', detail: 'עליך להתחבר כדי להוסיף לסל' });
          return;
        }

        const decoded = jwtDecode<MyDecodedToken>(token);
        const userId = Number(decoded.id);

        const addToBasket = async (basketId: number) => {
          // גישה לערך מהסיגנל לפי אינדקס
          const count = this.listValue()[index];

          for (let i = 0; i < count; i++) {
            const addPackage: AddPackageToBasket = { basketId, packageId: idPackage };
            try {
              await this.basketService.addPackageToBasket(addPackage).toPromise();
            } catch (err) {
              console.error("שגיאה בהוספת חבילה", err);
            }
          }

          // עדכון הסל בסיום
          this.basketService.getBasketByUserId(userId).subscribe(updatedBasket => {
            this.basketService.setBasket(updatedBasket);
          });

          this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'החבילות נוספו לסל' });

          // איפוס המונה הספציפי ל-1 בתוך הסיגנל
          this.listValue.update(vals => {
            const newVals = [...vals];
            newVals[index] = 1;
            return newVals;
          });
        };

        this.basketService.getBasketByUserId(userId).subscribe({
          next: basket => {
            this.basket = basket;
            addToBasket(this.basket.id);
          },
          error: err => {
            if (err.status === 400) {
              this.basketService.createBasket({ userId }).subscribe({
                next: newBasket => {
                  this.basket = newBasket;
                  addToBasket(newBasket.id);
                }
              });
            }
          }
        });
      }
    });
  }
}