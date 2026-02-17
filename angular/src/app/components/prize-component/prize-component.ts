import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Button } from "primeng/button";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GetPrize } from '../../models/prize.model';
import { PrizeService } from '../../services/prize-service';
import { GiftService } from '../../services/gift-service';
import { GetGift } from '../../models/gift.model';
import { GetUser } from '../../models/user.model';
import { UserService } from '../../services/userService';
import { saveAs } from 'file-saver';
import { OrderServise } from '../../services/order-servise';

@Component({
  selector: 'app-prize-component',
  standalone: true,
  imports: [Button, ToastModule],
  templateUrl: './prize-component.html',
  styleUrl: './prize-component.scss',
  providers: [MessageService]
})
export class PrizeComponent implements OnInit {
  private prizeService = inject(PrizeService);
  private giftService = inject(GiftService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private orderService = inject(OrderServise);

  // המרת המערכים לסיגנלים
  listPrize = signal<GetPrize[]>([]);
  listUser = signal<GetUser[]>([]);
  
  // דוגמה ל-computed: האם קיימות הגרלות במערכת?
  hasPrizes = computed(() => this.listPrize().length > 0);

  ngOnInit() {
    this.getAllPrize();
  }

  getAllPrize() {
    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => {
        this.listPrize.set(prizes); // עדכון הסיגנל
      },
      error: (error) => {
        console.error('Error retrieving prizes:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה לטעון את ההגרלות' });
      }
    });
  }

  getUserPrize() {
    const prizes = this.listPrize();
    prizes.forEach(prize => {
      this.userService.getUserById(prize.userId).subscribe({
        next: (user) => {
          // עדכון סיגנל של מערך: מוסיפים איבר חדש
          this.listUser.update(users => [...users, user]);
        },
        error: (error) => console.error('Error retrieving user details:', error)
      });
    });
  }

  createRandomPrize() {
    if (this.hasPrizes()) {
      this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: 'הגרלה כבר קיימת' });
      return;
    }
    
    this.giftService.getAllGift().subscribe({
      next: (gifts) => {
        if (gifts.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'מידע', detail: 'אין מתנות להגרלה' });
          return;
        }

        let finished = 0;
        let errors = 0;

        gifts.forEach(gift => {
          this.prizeService.GetRandomPrize(gift.id).subscribe({
            next: (prize) => {
              this.listPrize.update(prizes => [...prizes, prize]); // עדכון ריאקטיבי
              finished++;
              if (finished + errors === gifts.length) {
                this.getUserPrize();
                this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'ההגרלה בוצעה בהצלחה' });
              }
            },
            error: (error) => {
              errors++;
              if (finished + errors === gifts.length) {
                this.getUserPrize();
                this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'חלק מההגרלות נכשלו' });
              }
            }
          });
        });
      }
    });
  }

  exportPrizesToExcel() {
    this.prizeService.ExportPrizesToExcel().subscribe({
      next: (blob) => {
        saveAs(blob, 'prizes.csv');
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הקובץ יוצא בהצלחה' });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה יצירת קובץ האקסל' })
    });
  }

  ExportSumToExcel() {
    this.orderService.ExportSumToExcel().subscribe({
      next: (blob) => {
        saveAs(blob, 'prizes_sum.csv');
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הקובץ יוצא בהצלחה' });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה יצירת קובץ האקסל' })
    });
  }
}