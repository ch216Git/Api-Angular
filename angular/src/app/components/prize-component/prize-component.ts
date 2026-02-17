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
  // הזרקות
  prizeService: PrizeService = inject(PrizeService);
  giftService: GiftService = inject(GiftService);
  userService: UserService = inject(UserService);
  private messageService = inject(MessageService);
   orderService: OrderServise = inject(OrderServise);
  // הגדרת Signals - המשתנים שמשפיעים על ה-View
  listPrize = signal<GetPrize[]>([]);
  listUser = signal<GetUser[]>([]);
  listGift = signal<GetGift[]>([]); // אם תרצה להציג רשימת מתנות

  // פונקציה מחושבת לבדיקה האם יש הגרלות
  hasPrizes = computed(() => this.listPrize().length > 0);

  ngOnInit() {
    this.getAllPrize();
  }

  // שמירה על שמות הפונקציות המקוריים שלך
  getAllPrize() {
    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => {
        this.listPrize.set(prizes); // עדכון סיגנל
      },
      error: (error) => {
        console.error('Error retrieving prizes:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן היה לטעון את ההגרלות' });
      }
    });
  }

  getUserPrize() {
    const currentPrizes = this.listPrize(); 
    
    currentPrizes.forEach(prize => {
      this.userService.getUserById(prize.userId).subscribe({
        next: (user) => {
          this.listUser.update(users => [...users, user]);
        },
        error: (error) => console.error('Error retrieving user details:', error)
      });
    });
  }

createRandomPrize() {
  if (this.listPrize().length > 0) {
    this.messageService.add({ severity: 'warn', summary: 'אזהרה', detail: 'ההגרלה כבר בוצעה' });
    return;
  }
  
  this.giftService.getAllGift().subscribe({
    next: (gifts) => {
      if (!gifts || gifts.length === 0) return;

      gifts.forEach(gift => {
        this.prizeService.GetRandomPrize(gift.id).subscribe({
          next: (prize) => {
            if (prize) {
              // הוספת הפרס לרשימה
              this.listPrize.update(prizes => [...prizes, prize]);
              
              // שליפת פרטי הזוכה ספציפית לפרס הזה
              this.userService.getUserById(prize.userId).subscribe({
                next: (user) => {
                  this.listUser.update(users => [...users, user]);
                },
                error: (err) => console.error('Error fetching user:', err)
              });
            }
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: `לא ניתן לבצע את ההגרלה עבור המתנה ${gift.name}` });
            console.warn(`דילגתי על מתנה ${gift.id} - כנראה אין לה רוכשים.`);
          }
        });
      });

      this.messageService.add({ severity: 'success', summary: 'פעולה הושלמה', detail: 'ההגרלה הסתיימה עבור המתנות הרלוונטיות' });
    }
  });
}
  exportPrizesToExcel() {
    this.prizeService.ExportPrizesToExcel().subscribe({
      next: (blob) => {
        saveAs(blob, 'prizes.csv');
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הקובץ יוצא בהצלחה' });
      },
      error: (error) => {
        console.error('Error exporting prizes:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה יצירת קובץ האקסל' });
      }
    });
  }

  ExportSumToExcel() {
    this.orderService.ExportSumToExcel().subscribe({
      next: (blob) => {
        saveAs(blob, 'prizes_sum.csv');
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הקובץ יוצא בהצלחה' });
      },
      error: (error) => {
        console.error('Error exporting sum:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה יצירת קובץ האקסל' });
      }
    });
  }
}