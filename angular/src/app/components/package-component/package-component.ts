import { Component, inject } from '@angular/core';
import { PackageService } from '../../services/package-service';
import { GetPackage, PackageVM } from '../../models/package.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { BasketService } from '../../services/basket-service';
import { Token } from '@angular/compiler';
import { AddPackageToBasket, CreateBasket, GetBasketById, MyDecodedToken } from '../../models/basket.model';
import { jwtDecode } from 'jwt-decode';
import { PrizeService } from '../../services/prize-service';



@Component({
  selector: 'app-package-component',
  imports: [CommonModule, CardModule, FormsModule, InputNumber],
  templateUrl: './package-component.html',
  styleUrl: './package-component.scss',
})


export class PackageComponent {

  value1: number = 1;
  prizeService:PrizeService = inject(PrizeService);
  packageService: PackageService = inject(PackageService);
  basketService: BasketService = inject(BasketService);
  listPackages: PackageVM[] = [];
  maxCard: GetPackage[] = [];
  basket!:GetBasketById;
  listColors: string[] = [ 'altColorsCart_10', 'altColorsCart_3', 
    'altColorsCart_1','altColorsCart_30', 'altColorsCart_500', 'altColorsCart_300', 'altColorsCart_100',];
  listValue:number[]=[]

  
  ngOnInit() {
    this.getAllPackages();
  }

  getAllPackages() {
    this.packageService.getAllPackage().subscribe(data => {
      this.listPackages = data.map((p, index) => ({
        ...p,
        imageUrl: `https://localhost:7081/uploads/gift${index}.png`
      }));
  
      console.log(this.listPackages);
      this.listValue = new Array(this.listPackages.length).fill(1);
    });
  }  
  
addPackage(idPackage: number, index: number) {
  this.prizeService.getAllPrizes().subscribe({
    next: (prizes) => {
      if (prizes && prizes.length > 0) {
        console.log("לא ניתן להוסיף לסל - הסתיימה המכירה!");
        return;
      }
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        console.log("אתה צריך להתחבר");
        return;
      }

      const decoded = jwtDecode<MyDecodedToken>(token);
      const userId = Number(decoded.id);

      const addToBasket = async (basketId: number) => {
        for (let i = 0; i < this.listValue[index]; i++) {
          const addPackage: AddPackageToBasket = { basketId, packageId: idPackage };
          try {
            await this.basketService.addPackageToBasket(addPackage).toPromise();
            this.basketService.getBasketById(basketId).subscribe(updatedBasket => {
              this.basketService.setBasket(updatedBasket);
            });
          } catch (err) {
            console.error("שגיאה בהוספת חבילה", err);
          }
        }

        this.listValue[index] = 1;
      };

      this.basketService.getBasketByUserId(userId).subscribe({
        next: basket => {
          this.basket = basket;
          addToBasket(this.basket.id);
        },
        error: err => {
          if (err.status === 400) {
            const createBasket: CreateBasket = { userId };
            this.basketService.createBasket(createBasket).subscribe({
              next: newBasket => {
                this.basket = newBasket;
                addToBasket(newBasket.id);
              },
              error: createErr => console.error("כשלון ביצירת סל", createErr)
            });
          } else {
            console.error("שגיאה בקריאת סל", err);
          }
        }
      });
    },
    error: (err) => {
      console.error("שגיאה בבדיקת מצב המכירה", err);
    }
  });
}
}
