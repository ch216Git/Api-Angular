import { Component, inject, ChangeDetectorRef, signal, effect } from '@angular/core';
import { DonorService } from '../../services/donor-service';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast'; // ייבוא ToastModule
import { MessageService } from 'primeng/api'; // ייבוא MessageService
import { Router, RouterLink } from '@angular/router';
import { GetDonor, GetDonorById } from '../../models/donor.model';

@Component({
  selector: 'app-donor-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, CardModule, ButtonModule, DialogModule, InputTextModule, RouterLink, ToastModule],
  templateUrl: './donor-component.html',
  styleUrls: ['./donor-component.scss'],
  providers: [MessageService] // הוספת MessageService ל-providers
})
export class DonorComponent {
  donorService: DonorService = inject(DonorService);
  cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  router: Router = inject(Router);
  messageService: MessageService = inject(MessageService); // הזרקת ה-MessageService

  allDonor = signal<GetDonor[]>([]);
  allDonorWithGift = signal<GetDonorById[]>([]);
  visible = false;
  selectedDonor: any = { name: '', email: '', phone: '' };
  cuurentRoute = '';
  donorById: GetDonorById | undefined;

  selectedValue = signal('sortByName');
  nameSignal = signal('');

  ngOnInit() {
    this.cuurentRoute = this.router.url;
    this.getAllDonor();

    if (this.cuurentRoute.startsWith('/donor/') && this.cuurentRoute.length > '/donor/'.length) {
      const id = +this.cuurentRoute.substring('/donor/'.length);
      this.donorService.getDonorById(id).subscribe(data => {
        this.donorById = data;
        this.cd.markForCheck();
      });
    }
  }
  
  searchEffect = effect(() => {
    const searchText = this.nameSignal();
    const filterType = this.selectedValue();

    if (!searchText || searchText.trim() === '') {
      this.getAllDonor();
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

  onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedValue.set(select.value);
  }

  showDialog() {
    this.visible = true;
  }

  getAllDonor() {
    this.donorService.getAllDonor().subscribe(data => {
      this.allDonor.set(data);
      this.allDonorWithGift.set([]);
      
      data.forEach(donor => {
        this.donorService.getDonorById(donor.id).subscribe(c => {
          const exists = this.allDonorWithGift().some(d => d.id === c.id);
          if (!exists) {
            this.allDonorWithGift.set([...this.allDonorWithGift(), c]);
            this.cd.markForCheck();
          }
        });
      });
    });
  }

  editDonor(donor: any) {
    this.selectedDonor = { ...donor };
    this.visible = true;
  }

  saveDonor(idDonor: number) {
    const updateDonor = {
      id: idDonor,
      name: this.selectedDonor.name,
      email: this.selectedDonor.email,
      phone: this.selectedDonor.phone
    };

    this.donorService.updateDonor(updateDonor).subscribe({
      next: () => {
        // עדכון allDonor
        this.allDonor.set(
          this.allDonor().map(d => d.id === idDonor ? { ...d, ...this.selectedDonor } : d)
        );

        // עדכון allDonorWithGift
        this.allDonorWithGift.set(
          this.allDonorWithGift().map(d => d.id === idDonor ? { ...d, ...this.selectedDonor } : d)
        );

        this.selectedDonor = { name: '', email: '', phone: '' };
        this.visible = false;
        this.cd.markForCheck();
        
        // הודעת הצלחה
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם עודכן בהצלחה' });
      },
      error: (error) => {
        console.error('Error update donor:', error);
        // הודעת שגיאה
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה פעולת העדכון' });
      }
    });
  }

  deleteDonor(idDonor: number) {
    this.donorService.deleteDonor(idDonor).subscribe({
      next: () => {
        this.allDonor.set(this.allDonor().filter(d => d.id !== idDonor));
        this.allDonorWithGift.set(this.allDonorWithGift().filter(d => d.id !== idDonor));
        this.cd.markForCheck();
        
        // הודעת הצלחה
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נמחק בהצלחה' });
      },
      error: (err) => {
        console.error("Error deleting donor", err);
        // הודעת שגיאה
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'נכשלה פעולת המחיקה' });
      }
    });
  }
}