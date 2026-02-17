import { Component, inject, signal, OnInit } from '@angular/core';
import { PackageService } from '../../services/package-service';
import { PackageVM } from '../../models/package.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { BasketService } from '../../services/basket-service'
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
  private packageService = inject(PackageService);
  private basketService = inject(BasketService);
  private messageService = inject(MessageService);
  private prizeService = inject(PrizeService);

  // סיגנלים לניהול המצב
  listPackages = signal<PackageVM[]>([]);
  
  // ניהול המונים כסיגנל של אובייקט/מפה (כדי ששינוי במונה אחד לא ירנדר הכל)
  packageCounts = signal<{ [key: number]: number }>({});

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
        
        // אתחול המונים לכל חבילה
        const initialCounts: { [key: number]: number } = {};
        packages.forEach(p => initialCounts[p.id] = 1);
        this.packageCounts.set(initialCounts);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן לטעון חבילות' })
    });
  }

  // פונקציית עזר לעדכון מונה ספציפי בתוך הסיגנל
  updateCount(packageId: number, val: number) {
    this.packageCounts.update(prev => ({ ...prev, [packageId]: val }));
  }

  async addPackage(packageId: number) {
    // בדיקת מכירה פעילה
    this.prizeService.getAllPrizes().subscribe(async (prizes) => {
      if (prizes?.length > 0) {
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
      const count = this.packageCounts()[packageId] || 1;

      this.basketService.getBasketByUserId(userId).subscribe({
        next: async (basket) => {
          await this.processAddition(basket.id, packageId, count);
        },
        error: (err) => {
          if (err.status === 400) {
            this.basketService.createBasket({ userId }).subscribe((newBasket: GetBasketById) => {
               this.processAddition(newBasket.id, packageId, count);
            });
          }
        }
      });
    });
  }

  private async processAddition(basketId: number, packageId: number, count: number) {
    for (let i = 0; i < count; i++) {
      const addRequest: AddPackageToBasket = { basketId, packageId };
      await this.basketService.addPackageToBasket(addRequest).toPromise();
    }
    
    // עדכון הסיגנל המרכזי בסרוויס כדי שכל האתר יתעדכן
    this.basketService.loadBasketFromServer(this.getUserIdFromToken());
    this.messageService.add({ severity: 'success', summary: 'התווסף', detail: 'החבילות נוספו לסל בהצלחה' });
    this.updateCount(packageId, 1); // איפוס המונה ל-1
  }

  private getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    return token ? Number(jwtDecode<MyDecodedToken>(token).id) : 0;
  }
}