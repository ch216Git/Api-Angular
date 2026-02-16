import { Component, Input, inject } from '@angular/core';
import { GiftService } from '../../../services/gift-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateGift, GetGift, UpdateGift } from '../../../models/gift.model';
import { CommonModule } from '@angular/common';
import { UploadComponent } from '../../upload-component/upload-component';
import { GiftComponent } from '../gift-component/gift-component';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateCategory, GetCategory } from '../../../models/category.model';
import { CategoryService } from '../../../services/category-service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CreateDonor, GetDonor } from '../../../models/donor.model';
import { DonorService } from '../../../services/donor-service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-gift-component',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule, CommonModule, UploadComponent, AvatarModule, ButtonModule, DialogModule, InputTextModule],
  templateUrl: './add-gift-component.html',
  styleUrl: './add-gift-component.scss',
  providers: [MessageService]
})
export class AddGiftComponent {
  private messageService = inject(MessageService);
  giftService: GiftService = inject(GiftService);
  categoryService: CategoryService = inject(CategoryService);
  donorService: DonorService = inject(DonorService);
  
  listCategory: GetCategory[] = [];
  listDonor: GetDonor[] = [];
  gift?: GetGift;
  selectedFile: File | null = null;
  
  visible = false;
  visible1 = false;
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

  constructor(private route: ActivatedRoute, private router: Router) { }

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
        },
        error: (error) => {
          console.error('Error fetching gift:', error);
          this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן לטעון את פרטי המתנה' });
        }
      });
    }

    this.categoryService.getAllCategory().subscribe(data => this.listCategory = data);
    this.donorService.getAllDonor().subscribe(data => this.listDonor = data);
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  addOrEditGift() {
    if (this.gift) {
      this.updateGift();
    } else {
      this.addGift();
    }
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
        next: (gift) => {
          this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה בהצלחה!' });
          this.router.navigate(['/gifts']);
        },
        error: (error: any) => {
          console.error('Error add gift:', error);
          this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בהוספת המתנה' });
        }
      });
    };

    if (!this.selectedFile) {
      createGiftWithImage('');
      return;
    }

    this.giftService.uploadImage(this.selectedFile).subscribe({
      next: (res: any) => {
        const fileUrl = `https://localhost:7081${res.fileUrl}`;
        createGiftWithImage(fileUrl);
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העלאת התמונה נכשלה!' });
        console.error('Error upload image:', err);
      }
    });
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
        next: (gift) => {
          this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה עודכנה בהצלחה!' });
          this.router.navigate(['/gifts']);
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'עדכון המתנה נכשל!' });
          console.error('Error update gift:', error);
        }
      });
    };

    if (!this.selectedFile) {
      updateGiftWithImage(this.gift?.image ?? '');
      return;
    }

    this.giftService.uploadImage(this.selectedFile).subscribe({
      next: (res: any) => {
        const fileUrl = `https://localhost:7081${res.fileUrl}`;
        updateGiftWithImage(fileUrl);
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העלאת התמונה נכשלה!' });
        console.error('Error upload image:', err);
      }
    });
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'add') {
      this.visible = true;
      this.fromAddGift.get('categoryId')?.setValue(null);
    }
  }

  closeDialog() {
    this.visible = false;
    this.newCategoryName.reset();
  }

  save() {
    const name = this.newCategoryName.value;
    if (!name) return;

    this.categoryService.createCategory({ name: name }).subscribe({
      next: (category) => {
        this.listCategory.push(category);
        this.fromAddGift.get('categoryId')?.setValue(category.id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'קטגוריה נוספה בהצלחה!' });
        this.closeDialog();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בהוספת הקטגוריה' });
        console.error('שגיאה:', error);
      }
    });
  }

  onDonorChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'add') {
      this.visible1 = true;
      this.fromAddGift.get('donorId')?.setValue(null);
    }
  }

  closeDialog1() {
    this.visible1 = false;
    this.fromDonor.reset();
  }

  saveDonor() {
    if (!this.fromDonor.valid) return;
    
    this.donorService.createDonor(this.fromDonor.value).subscribe({
      next: (donor) => {
        this.listDonor.push(donor);
        this.fromAddGift.get('donorId')?.setValue(donor.id);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נוסף בהצלחה!' });
        this.closeDialog1();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בהוספת התורם!' });
        console.error('Error:', error);
      }
    });
  }
}