import { Component, Input, inject } from '@angular/core';
import { OrderServise } from '../../services/order-servise';
import { GetUser } from '../../models/user.model';
import { GetOrder } from '../../models/order.model';
import { GiftService } from '../../services/gift-service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-component',
  imports: [CommonModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.scss',
})
export class OrderComponent {
orderService:OrderServise=inject(OrderServise);
listBuyer:GetUser[]=[]
// @Input() giftId!: number;
buyers$!: Observable<GetUser[]>;

@Input()
set giftId(value: number) {
  if (value) {
    this.buyers$ = this.orderService.getBuyers(value); // מחזיר Observable<GetUser[]>
  }
}

// ngOnInit(){
//   this.getOrderByGift(this.giftId);
// }
// ngOnChanges() {
//   // this.listBuyer=[]
//   if (this.giftId) {
//     this.getOrderByGift(this.giftId)
//   }
// }

getOrderByGift(id:number){
this.orderService.getBuyers(id).subscribe(data=>{
  this.listBuyer = data;
  // console.log(this.listBuyer+"jhg")
})
}

}
