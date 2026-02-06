import { Component, inject } from '@angular/core';
import { GiftService } from '../../../services/gift-service';
import { GetGift } from '../../../models/gift.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gift-id-component',
  imports: [],
  templateUrl: './gift-id-component.html',
  styleUrl: './gift-id-component.scss',
})
export class GiftIdComponent {
  giftService: GiftService=inject(GiftService);
  constructor(private route: ActivatedRoute){}
  giftId:GetGift|undefined;
  
  ngOnInit(){
    const giftId = this.route.snapshot.paramMap.get('id');
    this.getById(giftId? +giftId : 0);
  }

  getById(id:number){
    this.giftService.getGiftById(id).subscribe(data=>{
      this.giftId=data;
      console.log(this.giftId);
    });
  }
}
