import { Component, inject, signal, computed, effect } from '@angular/core';
import { DonorService } from '../../services/donor-service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { GetDonor, GetDonorById } from '../../models/donor.model';
import { MyDecodedToken } from '../../models/basket.model';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donor-component',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, DialogModule, InputTextModule, RouterLink, ToastModule],
  templateUrl: './donor-component.html',
  styleUrls: ['./donor-component.scss'],
  providers: [MessageService]
})
export class DonorComponent {
  donorService = inject(DonorService);
  router = inject(Router);
  private messageService = inject(MessageService);

  // 🔹 Signals (לדאטה ריאקטיבי בלבד)
  allDonorWithGift = signal<GetDonorById[]>([]);
  donorById = signal<GetDonorById | null>(null);
  selectedDonor = signal<any>({});
  selectedValue = signal('sortByName');
  nameSignal = signal('');

  // 🔸 משתנים רגילים (לא חייבים להיות Signals)
  visible = false;
  role = '';
  currentRoute = '';

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<MyDecodedToken>(token);
      this.role = decoded.role;
    }
    this.currentRoute = this.router.url;
    if (this.currentRoute === '/donor')
      this.loadAllDonors();
    if (this.currentRoute.startsWith('/donor/') && this.currentRoute.length > '/donor/'.length) {
      const id = +this.currentRoute.substring('/donor/'.length);
      this.donorService.getDonorById(id).subscribe(data => this.donorById.set(data));
    }
  }
 searchEffect = effect(() => {
    const searchText = this.nameSignal();
    const filterType = this.selectedValue();

    if (!searchText || searchText.trim() === '') {
      this.loadAllDonors();
      return;
    }

    if (filterType === 'sortByName') {
      this.donorService.SearchByName(searchText).subscribe(data => {
        this.allDonorWithGift.set(data);
      });
    }
    else if (filterType === 'sortByEmail') {
      this.donorService.SearchByEmail(searchText).subscribe(data => {
        this.allDonorWithGift.set(data);
      });
    }
    else if (filterType === 'sortByGiftName') {
      this.donorService.SearchByGiftName(searchText).subscribe(data => {
        this.allDonorWithGift.set(data);
      });
    }
  });

  loadAllDonors() {
   this.donorService.getAllDonor().subscribe(data => {
      this.allDonorWithGift.set([]);
      data.forEach(donor => {
        this.donorService.getDonorById(donor.id).subscribe(c => {
          const exists = this.allDonorWithGift().some(d => d.id === c.id);
          if (!exists) {
            this.allDonorWithGift.set([...this.allDonorWithGift(), c]);
          }
        });
      });
    });
  }

  onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedValue.set(select.value);
  }

  editDonor(donor: any) {
    this.selectedDonor.set({ ...donor });
    this.visible = true;
  }

  saveDonor(idDonor: number) {
    const updateData = { id: idDonor, ...this.selectedDonor() };
    this.donorService.updateDonor(updateData).subscribe({
      next: () => {
        this.allDonorWithGift.update(list =>
          list.map(d => d.id === idDonor ? { ...d, ...updateData } : d)
        );
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם עודכן' });
      }
    });
  }

  deleteDonor(idDonor: number) {
    this.donorService.deleteDonor(idDonor).subscribe({
      next: () => {
        this.allDonorWithGift.update(list => list.filter(d => d.id !== idDonor));
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נמחק' });
      }
    });
  }
}
