import { Component, inject, OnInit } from '@angular/core'; // הוספת OnInit
import { Button } from "primeng/button";
import { ToastModule } from 'primeng/toast'; // ייבוא מודול ה-Toast
import { MessageService } from 'primeng/api'; // ייבוא השירות
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
  standalone: true, // בהנחה שזה רכיב עצמאי
  imports: [Button, ToastModule], // הוספת ToastModule
  templateUrl: './prize-component.html',
  styleUrl: './prize-component.scss',
  providers: [MessageService] // הוספת ה-Service ל-Providers
})
export class PrizeComponent implements OnInit {
  prizeService: PrizeService = inject(PrizeService);
  giftService: GiftService = inject(GiftService);
  userService: UserService = inject(UserService);
  messageService: MessageService = inject(MessageService); // הזרקת השירות
  orderService: OrderServise = inject(OrderServise);
  listPrize: GetPrize[] = [];
  listGift: GetGift[] = [];
  listUser: GetUser[] = [];
  listGiftNotPrize: number[] = [];

  ngOnInit() {
    this.getAllPrize();
  }

  exportPrizesToExcel() {
    this.prizeService.ExportPrizesToExcel().subscribe({
      next: (blob) => {
        saveAs(blob, 'prizes.csv');
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הקובץ יוצא בהצלחה' }); //
      },
      error: (error) => {
        console.error('Error exporting prizes to Excel:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה יצירת קובץ האקסל' }); //
      }
    });
  }

  getUserPrize() {
    for (let i = 0; i < this.listPrize.length; i++) {
      this.userService.getUserById(this.listPrize[i].userId).subscribe({
        next: (user) => {
          this.listUser.push(user);
        },
        error: (error) => {
          console.error('Error retrieving user details:', error);
        }
      })
    }
  }

  getAllPrize() {
    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => {
        this.listPrize = prizes;
      },
      error: (error) => {
        console.error('Error retrieving prizes:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה לטעון את ההגרלות' }); //
      }
    });
  }

  createRandomPrize() {
    if (this.listPrize.length > 0) {
      this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: 'הגרלה כבר קיימת' }); //
      return;
    }
    
    this.giftService.getAllGift().subscribe({
      next: (gifts) => {
        if(gifts.length === 0) {
            this.messageService.add({ severity: 'info', summary: 'מידע', detail: 'אין מתנות להגרלה' }); //
            return;
        }

        let finished = 0;
        let errors = 0;

        for (let i = 0; i < gifts.length; i++) {
          this.prizeService.GetRandomPrize(gifts[i].id).subscribe({
            next: (prize) => {
              this.listPrize.push(prize);
              finished++;
              if (finished + errors === gifts.length) {
                this.getUserPrize();
                this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'ההגרלה בוצעה בהצלחה' }); //
              }
            },
            error: (error) => {
              errors++;
              console.error('Error creating random prize:', error);
              
              if (finished + errors === gifts.length) {
                this.getUserPrize();
                this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'חלק מההגרלות נכשלו' }); //
              }
            }
          });
        }
      },
      error: (error) => {
        console.error('Error retrieving gifts:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה לטעון מתנות' }); //
      }
    });
  }
  ExportSumToExcel() {
  this.orderService.ExportSumToExcel().subscribe({
    next: (blob) => {
      saveAs(blob, 'prizes.csv');
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הקובץ יוצא בהצלחה' }); 
    },
    error: (error) => {
      console.error('Error exporting sum to Excel:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה יצירת קובץ האקסל' });
    }
  });
}
}