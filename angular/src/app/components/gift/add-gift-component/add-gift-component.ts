import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
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
  imports: [ToastModule, ReactiveFormsModule, CommonModule, UploadComponent, AvatarModule, ButtonModule, DialogModule, InputTextModule],
  templateUrl: './add-gift-component.html',
  styleUrl: './add-gift-component.scss',
  providers: [MessageService]
})
export class AddGiftComponent implements OnInit {
  private messageService = inject(MessageService);
  giftService: GiftService = inject(GiftService);
  categoryService: CategoryService = inject(CategoryService);
  donorService: DonorService = inject(DonorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // --- Signals: רק מה שבאמת משתנה ב-UI ---
  listCategory = signal<GetCategory[]>([]);
  listDonor = signal<GetDonor[]>([]);
  visible = signal(false); 
  visible1 = signal(false);

  // --- משתנים רגילים: אין צורך בסיגנל כי הם לא "רוקדים" ב-HTML לבד ---
  gift?: GetGift;
  selectedFile: File | null = null;

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

  newCategoryName = new FormControl('', Validators.required);

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

    this.categoryService.getAllCategory().subscribe(data => this.listCategory.set(data));
    this.donorService.getAllDonor().subscribe(data => this.listDonor.set(data));
  }
  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  addOrEditGift() {
    if (this.gift) 
      this.updateGift();
    else 
      this.addGift();
  }

  addGift() {
    const createGiftWithImage = (imageUrl: string) => {
      const newGift: CreateGift = {
        ...this.fromAddGift.value,
        image: imageUrl,
        value: Number(this.fromAddGift.value.value),
        categoryId: Number(this.fromAddGift.value.categoryId),
        donorId: Number(this.fromAddGift.value.donorId),
      };

      this.giftService.createGift(newGift).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה בהצלחה!' });
          this.router.navigate(['/gifts']);
        }
      });
    };

    if (!this.selectedFile) {
      createGiftWithImage('');
    } else {
      this.giftService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => createGiftWithImage(`https://localhost:7081${res.fileUrl}`)
      });
    }
  }

  updateGift() {
    const updateGiftWithImage = (imageUrl: string) => {
      const updatedGift: UpdateGift = {
        ...this.fromAddGift.value,
        id: this.gift?.id,
        image: imageUrl,
        value: Number(this.fromAddGift.value.value),
        categoryId: Number(this.fromAddGift.value.categoryId),
        donorId: Number(this.fromAddGift.value.donorId),
      };

      this.giftService.updateGift(updatedGift).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה עודכנה בהצלחה!' });
          this.router.navigate(['/gifts']);
        }
      });
    };

    if (!this.selectedFile) {
      updateGiftWithImage(this.gift?.image ?? '');
    } else {
      this.giftService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => updateGiftWithImage(`https://localhost:7081${res.fileUrl}`)
      });
    }
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'add') {
      this.visible.set(true); 
      this.fromAddGift.get('categoryId')?.setValue(null);
    }
  }

  closeDialog() {
    this.visible.set(false); 
    this.newCategoryName.reset();
  }

  save() {
    const name = this.newCategoryName.value;
    if (!name) return;

    this.categoryService.createCategory({ name }).subscribe({
      next: (category) => {
        this.listCategory.update(prev => [...prev, category]); // עדכון רשימה בסיגנל
        this.fromAddGift.get('categoryId')?.setValue(category.id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'קטגוריה נוספה!' });
        this.closeDialog();
      }
    });
  }

  onDonorChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'add') {
      this.visible1.set(true); 
      this.fromAddGift.get('donorId')?.setValue(null);
    }
  }

  closeDialog1() {
    this.visible1.set(false); 
    this.fromDonor.reset();
  }

  saveDonor() {
    if (!this.fromDonor.valid) return;

    this.donorService.createDonor(this.fromDonor.value).subscribe({
      next: (donor) => {
        this.listDonor.update(prev => [...prev, donor]); // עדכון רשימה בסיגנל
        this.fromAddGift.get('donorId')?.setValue(donor.id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נוסף!' });
        this.closeDialog1();
      }
    });
  }
}