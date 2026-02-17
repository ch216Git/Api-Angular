import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services & Models
import { GiftService } from '../../../services/gift-service';
import { CategoryService } from '../../../services/category-service';
import { DonorService } from '../../../services/donor-service';
import { GetGift, CreateGift, UpdateGift } from '../../../models/gift.model';
import { GetCategory } from '../../../models/category.model';
import { GetDonor } from '../../../models/donor.model';
import { UploadComponent } from '../../upload-component/upload-component';

@Component({
  selector: 'app-add-gift-component',
  standalone: true,
  imports: [
    ToastModule, 
    ReactiveFormsModule, 
    CommonModule, 
    UploadComponent, 
    AvatarModule, 
    ButtonModule, 
    DialogModule, 
    InputTextModule
  ],
  templateUrl: './add-gift-component.html',
  styleUrl: './add-gift-component.scss',
  providers: [MessageService]
})
export class AddGiftComponent implements OnInit {
  private messageService = inject(MessageService);
  private giftService = inject(GiftService);
  private categoryService = inject(CategoryService);
  private donorService = inject(DonorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // --- Signals (מקורות המידע) ---
  listCategory = signal<GetCategory[]>([]);
  listDonor = signal<GetDonor[]>([]);
  visible = signal(false); 
  visible1 = signal(false);
  
  gift: GetGift | undefined;
  selectedFile: File | null = null;
  newCategoryName = new FormControl('', Validators.required);

  fromAddGift: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    image: new FormControl(''),
    value: new FormControl('', [Validators.required, Validators.min(0)]),
    categoryId: new FormControl(null, Validators.required),
    donorId: new FormControl(null, Validators.required),
  });

  fromDonor: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl('', Validators.pattern('^\\+?[0-9]{10,12}$')),
  });

  ngOnInit() {
    const giftId = this.route.snapshot.paramMap.get('id');
    if (giftId) {
      this.giftService.getGiftById(+giftId).subscribe({
        next: (gift) => {
          this.gift = gift;
          this.fromAddGift.patchValue({
            name: gift.name,
            description: gift.description,
            image: gift.image,
            value: gift.value,
            categoryId: gift.category.id,
            donorId: gift.donor.id,
          });
        }
      });
    }

    // טעינת רשימות ראשוניות לסיגנלים
    this.categoryService.getAllCategory().subscribe(data => this.listCategory.set(data));
    this.donorService.getAllDonor().subscribe(data => this.listDonor.set(data));
  }

  // --- לוגיקת קטגוריה ותורם ---

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'add') {
      this.visible.set(true);
      this.fromAddGift.get('categoryId')?.setValue(null);
    }
  }

  onDonorChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'add') {
      this.visible1.set(true);
      this.fromAddGift.get('donorId')?.setValue(null);
    }
  }

  save() {
    const name = this.newCategoryName.value;
    if (!name) return;
    this.categoryService.createCategory({ name }).subscribe({
      next: (category) => {
        this.listCategory.update(prev => [...prev, category]);
        this.fromAddGift.get('categoryId')?.setValue(category.id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'קטגוריה נוספה' });
        this.closeDialog();
      }
    });
  }

  saveDonor() {
    if (this.fromDonor.invalid) return;
    this.donorService.createDonor(this.fromDonor.value).subscribe({
      next: (donor) => {
        this.listDonor.update(prev => [...prev, donor]);
        this.fromAddGift.get('donorId')?.setValue(donor.id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נוסף' });
        this.closeDialog1();
      }
    });
  }

  // --- פעולות עזר ---

  closeDialog() { this.visible.set(false); this.newCategoryName.reset(); }
  closeDialog1() { this.visible1.set(false); this.fromDonor.reset(); }
  onFileSelected(file: File) { this.selectedFile = file; }

  addOrEditGift() {
    if (this.gift) this.updateGift();
    else this.addGift();
  }

  private addGift() {
    const createWithImg = (url: string) => {
      const newGift = { ...this.fromAddGift.value, image: url };
      this.giftService.createGift(newGift).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'מתנה נוספה!' });
        this.router.navigate(['/gifts']);
      });
    };

    if (this.selectedFile) {
      this.giftService.uploadImage(this.selectedFile).subscribe((res: any) => 
        createWithImg(`https://localhost:7081${res.fileUrl}`));
    } else createWithImg('');
  }

  private updateGift() {
    const updateWithImg = (url: string) => {
      const updatedGift = { ...this.fromAddGift.value, id: this.gift?.id, image: url };
      this.giftService.updateGift(updatedGift).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'מתנה עודכנה!' });
        this.router.navigate(['/gifts']);
      });
    };

    if (this.selectedFile) {
      this.giftService.uploadImage(this.selectedFile).subscribe((res: any) => 
        updateWithImg(`https://localhost:7081${res.fileUrl}`));
    } else updateWithImg(this.gift?.image ?? '');
  }
}