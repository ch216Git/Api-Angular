import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; //
import { PackageService } from '../../services/package-service'; //
import { GetPackage, PackageVM } from '../../models/package.model'; //
import { CommonModule } from '@angular/common'; //
import { CardModule } from 'primeng/card'; //
import { FormsModule } from '@angular/forms'; //
import { InputNumber } from 'primeng/inputnumber'; //
import { BasketService } from '../../services/basket-service'; //
import { AddPackageToBasket, CreateBasket, GetBasketById, MyDecodedToken } from '../../models/basket.model'; //
import { jwtDecode } from 'jwt-decode'; //
import { ToastModule } from 'primeng/toast'; //
import { MessageService } from 'primeng/api'; //

@Component({
  selector: 'app-package-component',
  standalone: true,
  imports: [CommonModule, CardModule, FormsModule, InputNumber, ToastModule],
  templateUrl: './package-component.html',
  styleUrl: './package-component.scss',
  providers: [MessageService]
})
export class PackageComponent implements OnInit {

  value1: number = 1;
  packageService: PackageService = inject(PackageService);
  basketService: BasketService = inject(BasketService);
  messageService: MessageService = inject(MessageService);
  
  // הזרקת ChangeDetectorRef לתיקון בעיות תצוגה
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef); //
  
  listPackages: PackageVM[] = [];
  maxCard: GetPackage[] = [];
  basket!:GetBasketById;
  listColors: string[] = [ 'altColorsCart_10', 'altColorsCart_3', 
    'altColorsCart_1','altColorsCart_30', 'altColorsCart_500', 'altColorsCart_300', 'altColorsCart_100',];
  listValue:number[]=[]

  
  ngOnInit() {
    this.getAllPackages();
  }

  // פונקציית עזר להצגת הודעות ועדכון ה-View
  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail }); //
    this.cdr.detectChanges(); //
  }

  getAllPackages() {
    this.packageService.getAllPackage().subscribe({
      next: (data) => {
        this.listPackages = data.map((p, index) => ({
          ...p,
          imageUrl: `https://localhost:7081/uploads/gift${index}.png`
        }));
        this.listValue = new Array(this.listPackages.length).fill(1);
      },
      error: (err) => {
        this.showMessage('error', 'שגיאה', 'לא ניתן לטעון את החבילות'); //
      }
    });
  }  
  
  addPackage(idPackage: number, index: number) {
    const token: string | null = localStorage.getItem('token'); //
    if (!token) {
      this.showMessage('warn', 'אזהרה', 'יש להתחבר למערכת כדי להוסיף לסל'); //
      return;
    }
  
    const decoded = jwtDecode<MyDecodedToken>(token); //
    const userId = Number(decoded.id); //
  
    const addToBasket = async(basketId: number) => {
      try {
        for (let i = 0; i < this.listValue[index]; i++) {
          const addPackage: AddPackageToBasket = { basketId, packageId: idPackage }; //
          await this.basketService.addPackageToBasket(addPackage).toPromise(); //
        }
        
        this.basketService.getBasketById(basketId).subscribe(updatedBasket => { //
          this.basketService.setBasket(updatedBasket); //
          this.listValue[index]=1;
          this.showMessage('success', 'הצלחה', 'החבילה התווספה לסל'); //
        });
      } catch (err) {
        this.showMessage('error', 'שגיאה', 'אירעה שגיאה בהוספת החבילה'); //
      }
    }
  
    this.basketService.getBasketByUserId(userId).subscribe({ //
      next: basket => {
        this.basket = basket;
        addToBasket(this.basket.id);
      },
      error: err => {
        if (err.status === 400) { // אין סל קיים
          const createBasket: CreateBasket = { userId }; //
          this.basketService.createBasket(createBasket).subscribe({ //
            next: newBasket => {
              this.basket = newBasket;
              addToBasket(newBasket.id);
            },            
            error: createErr => {
              this.showMessage('error', 'שגיאה', 'לא ניתן ליצור סל חדש'); //
            }
          });
        } else {
          this.showMessage('error', 'שגיאה', 'אירעה שגיאה בתקשורת'); //
        }
      }
    });
  }
}