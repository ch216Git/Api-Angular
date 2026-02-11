import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { GetPrize } from '../../models/prize.model';
import { PrizeService } from '../../services/prize-service';
import { GiftService } from '../../services/gift-service';
import { GetGift } from '../../models/gift.model';
import { GetUser } from '../../models/user.model';
import { UserService } from '../../services/userService';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-prize-component',
  imports: [Button],
  templateUrl: './prize-component.html',
  styleUrl: './prize-component.scss',
})
export class PrizeComponent {
prizeService:PrizeService=inject(PrizeService);
giftService:GiftService=inject(GiftService);
userService:UserService=inject(UserService);
listPrize:GetPrize[] = [];
// exsist:boolean=false;
listGift:GetGift[]=[];
listUser:GetUser[]=[];
listGiftNotPrize:number[]=[]
ngOnInit(){
  this.getAllPrize();
  // this.getAllGift();
  // this.getUserPrize();

}
// getAllGift(){
//   this.giftService.getAllGift().subscribe({
//     next:(gifts)=>{
//       this.listGift = gifts;
//       // console.log(this.listGift);
//     },
//     error:(error)=>{
//       console.error('Error retrieving gifts:',error);
//     }
//   });
// }

// getAllUser(){
//   this.userService.getAllUser().subscribe({
//     next:(users)=>{
//       this.listUser = users;
//       // console.log(this.listUser);
//     },
//     error:(error)=>{
//       console.error('Error retrieving users:',error);
//     }
//   });
// }


exportPrizesToExcel() {
  this.prizeService.ExportPrizesToExcel().subscribe({
    next: (blob) => {
     
      saveAs(blob, 'prizes.xlsx');
    },
    error: (error) => {
      console.error('Error exporting prizes to Excel:', error);
    }
  });
}
getUserPrize(){
  for(let i=0;i<this.listPrize.length;i++){
    this.userService.getUserById(this.listPrize[i].userId).subscribe({
      next:(user)=>{
        console.log(user);
        this.listUser.push(user);
      },
      error:(error)=>{
        console.error('Error retrieving user details:',error);
      }
    })
  }
}
getAllPrize(){
  this.prizeService.getAllPrizes().subscribe({
    next:(prizes)=>{
      this.listPrize = prizes;
      console.log(this.listPrize);
    },
    error:(error)=>{
      console.error('Error retrieving prizes:',error);
    }
  });
}

createRandomPrize() {
  if (this.listPrize.length>0) {
    console.log('Random prize already exists.');
    return;
  }
  this.giftService.getAllGift().subscribe({
    next: (gifts) => {
      let finished = 0; 
      for (let i = 0; i < gifts.length; i++) {
        this.prizeService.GetRandomPrize(gifts[i].id).subscribe({
          next: (prize) => {
            console.log('Random prize created:', prize);
            this.listPrize.push(prize);
            finished++;
            if (finished === gifts.length) {
              this.getUserPrize();
            }
          },
          error: (error) => {
              finished++;
              this.listUser.push(null as any);
            if (error.status === 400) {
              
              console.log(error.error); // no buyers for this gift
            } else {
              console.error('Error creating random prize:', error);
            }

            // גם אם יש שגיאות – עדיין בודקים סיום
            if (finished === gifts.length) {
              this.getUserPrize();
            }
          }
        });
      }
    },
    error: (error) => {
      console.error('Error retrieving gifts:', error);
    }
  });
}
  
}

