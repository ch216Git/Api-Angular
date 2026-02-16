import { ChangeDetectorRef, Component, Input, inject, OnInit } from '@angular/core';
import { OrderServise } from '../../services/order-servise';
import { GetUser } from '../../models/user.model';
import { CommonModule } from '@angular/common';
// ייבוא MessageService ו-ToastModule
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-order-component',
  standalone: true,
  // הוספת ToastModule לרשימת הייבוא
  imports: [CommonModule, ToastModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.scss',
  // הוספת MessageService ל-providers
  providers: [MessageService]
})
export class OrderComponent implements OnInit {
  orderService: OrderServise = inject(OrderServise);
  // הזרקת MessageService
  messageService: MessageService = inject(MessageService);
  
  listBuyer: GetUser[] = [];
  @Input() giftId: number | undefined;

  cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    if (this.giftId)
      this.getOrderByGift(this.giftId);
  }

  getOrderByGift(id: number) {
    this.orderService.getBuyers(id).subscribe({
      next: (data) => {
        this.listBuyer = data;
        this.cd.markForCheck();
      },
      error: (err) => {
        // הצגת הודעת שגיאה במקרה של תקלה
        this.messageService.add({
          severity: 'error',
          summary: 'שגיאה',
          detail: 'לא ניתן לטעון את רשימת הקונים'
        });
        console.error(err);
      }
    });
  }
}