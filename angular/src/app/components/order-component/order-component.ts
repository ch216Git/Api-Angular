import { Component, Input, inject, OnInit, signal, input, effect } from '@angular/core';
import { OrderServise } from '../../services/order-servise';
import { GetUser } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-order-component',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.scss',
  providers: [MessageService]
})
export class OrderComponent {
  orderService:OrderServise = inject(OrderServise);
  private messageService = inject(MessageService);
  giftId = input<number | undefined>();
  listBuyer = signal<GetUser[]>([]);

  constructor() {
    effect(() => {
      const id = this.giftId();
      if (id) {
        this.getOrderByGift(id);
      } else {
        this.listBuyer.set([]);
      }
    });
  }

  getOrderByGift(id: number) {
    this.orderService.getBuyers(id).subscribe({
      next: (data) => {
        this.listBuyer.set(data);
      },
      error: (err) => {
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