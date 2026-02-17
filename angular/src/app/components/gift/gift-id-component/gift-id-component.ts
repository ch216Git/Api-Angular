import { Component, inject, signal, OnInit } from '@angular/core';
import { GiftService } from '../../../services/gift-service';
import { GetGift } from '../../../models/gift.model';
import { ActivatedRoute } from '@angular/router';
import { OrderComponent } from '../../order-component/order-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gift-id-component',
  standalone: true, // הנחה שהיא Standalone לפי ה-imports
  imports: [OrderComponent, CommonModule],
  templateUrl: './gift-id-component.html',
  styleUrl: './gift-id-component.scss',
})
export class GiftIdComponent implements OnInit {
  private giftService = inject(GiftService);
  private route = inject(ActivatedRoute);

  // הגדרת המשתנה כסיגנל
  gift = signal<GetGift | undefined>(undefined);
  
  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;
    this.getById(id);
  }

  getById(id: number) {
    this.giftService.getGiftById(id).subscribe(data => {
      this.gift.set(data); // עדכון הסיגנל מעדכן את ה-UI אוטומטית
    });
  }
}