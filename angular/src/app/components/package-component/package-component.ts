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



@Component({
  selector: 'app-package-component',
  imports: [CommonModule, CardModule, FormsModule, InputNumber],
  templateUrl: './package-component.html',
  styleUrl: './package-component.scss',
})


export class PackageComponent {

  value1: number = 1;
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
  
  addPackage(idPackage: number,index:number) {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.log("אתה צריך להתחבר");
      return;
    }
  
    const decoded = jwtDecode<MyDecodedToken>(token);
    const userId = Number(decoded.id);
  
    const addToBasket = async(basketId: number) => {
      for (let i = 0; i < this.listValue[index]; i++) {
        console.log(i);
        
        const addPackage: AddPackageToBasket = { basketId, packageId: idPackage };
        // מחזיקים index בתוך subscribe כדי לדעת מה המספר
        await this.basketService.addPackageToBasket(addPackage).toPromise();
        this.basketService.getBasketById(basketId).subscribe(updatedBasket => {
          this.basketService.setBasket(updatedBasket);
          this.listValue[index]=1
        });
      }
    }
    // const addToBasket = (basketId: number) => {
    //   for (let i = 0; i < this.listValue[index]; i++) {
    //     const addPackage: AddPackageToBasket = { basketId, packageId: idPackage };
    //     // מחזיקים index בתוך subscribe כדי לדעת מה המספר
    //     this.basketService.addPackageToBasket(addPackage).subscribe({
    //       next: res => console.log(`הצלחה #${i + 1}`, res),
    //       error: err => console.error(`כשלון #${i + 1}`, err)
    //     });
    //   }
    // }
  
    this.basketService.getBasketByUserId(userId).subscribe({
      next: basket => {
        console.log("kpbh");
        this.basket = basket;
        addToBasket(this.basket.id);
      },
      error: err => {
        if (err.status === 400) { // אין סל קיים
     
          
          const createBasket: CreateBasket = { userId };
          this.basketService.createBasket(createBasket).subscribe({
            next: newBasket => {
              this.basket = newBasket; // <--- מעדכן את הקומפוננטה
              addToBasket(newBasket.id);
            },            
            error: createErr => console.error("כשלון ביצירת סל", createErr)
          });
        } else {
          console.error("שגיאה בקריאת סל", err);
        }
      }
    });
  }
  // deletePackage
}
