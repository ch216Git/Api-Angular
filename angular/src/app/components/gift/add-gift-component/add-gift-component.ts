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
import { email } from '@angular/forms/signals';

import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-gift-component',
  standalone: true,
  imports: [ToastModule,ReactiveFormsModule, CommonModule, UploadComponent, AvatarModule, ButtonModule, DialogModule, InputTextModule],
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
  constructor(private route: ActivatedRoute, private router: Router) { }

  fromAddGift: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    image: new FormControl(''),
    value: new FormControl('', [Validators.min(0)]),
    // priceCard: new FormControl('', [Validators.required, Validators.min(0)]),
    categoryId: new FormControl(null, Validators.required),
    donorId: new FormControl(null, Validators.required),
    // typeCard: new FormControl('Normal'),
  })
  visible = false;
  visible1 = false;
  newCategoryName = new FormControl('', Validators.required);
  fromDonor: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl('', Validators.pattern('^\\+?[0-9]{10,12}$')),

  })
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
            // priceCard: gift.priceCard,
            categoryId: gift.category.id,
            donorId: gift.donor.id,
            // typeCard: Object.keys(this.typeCardMap).find(
            //   key => this.typeCardMap[key as keyof typeof this.typeCardMap] === Number(gift.typeCard)
            // ) || 'Normal'


          });
        },
        error: (error) => console.error('Error fetching gift:', error)
      });
    }
    this.categoryService.getAllCategory().subscribe(data => {
      this.listCategory = data;
      console.log(this.listCategory);
    });
    this.donorService.getAllDonor().subscribe(data => {
      this.listDonor = data;
      console.log(this.listDonor);
    })
  }
  gift?: GetGift;
  // typeCardMap = {
  //   Normal: 0,
  //   Special: 1
  // };
  selectedFile: File | null = null;

  addOrEditGift() {

    if (this.gift) {
      this.updateGift();
      console.log("update");

    } else {
      this.addGift();
      console.log("add");

    }
  }
  onFileSelected(file: File) {
    this.selectedFile = file;

    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   const dataUrl = e.target.result;
    //   this.fromAddGift.get('image')?.setValue(dataUrl);
    //   if (this.gift) {
    //     this.gift.image = dataUrl;
    //   }
    // };
    // reader.readAsDataURL(file);
  }

  addGift() {
    const createGiftWithImage = (imageUrl: string) => {
      const newGift: CreateGift = {
        ...this.fromAddGift.value,
        image: imageUrl,
        value: Number(this.fromAddGift.value.value),
        // priceCard: Number(this.fromAddGift.value.priceCard),
        categoryId: Number(this.fromAddGift.value.categoryId),
        donorId: Number(this.fromAddGift.value.donorId),
        // typeCard: this.typeCardMap[this.fromAddGift.value.typeCard as keyof typeof this.typeCardMap]
      };

      this.giftService.createGift(newGift).subscribe({
        next: (gift) => {
          console.log('Add gift successfully:', gift);
           this.messageService.add({ 
          severity: 'success', 
          summary: 'הצלחה', 
          detail: 'המתנה נוספה בהצלחה!' 
        });
          this.fromAddGift.reset();
          this.selectedFile = null;
          this.router.navigate(['/gifts']);
        },
        error: (error: any) =>
          console.error('Error add gift:', error),
      });
    };

    if (!this.selectedFile) {
      createGiftWithImage('');
      return;
    }
    this.giftService.uploadImage(this.selectedFile).subscribe({
      next: (res: any) => {
        const fileUrl = `https://localhost:7081${res.fileUrl}`;
        if (this.gift) {
          this.gift.image = fileUrl;
        }
        createGiftWithImage(fileUrl);
         this.messageService.add({ 
          severity: 'success', 
          summary: 'הצלחה', 
          detail: 'המתנה עודכנה בהצלחה!' 
        });
      },
      error: (err: any) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'שגיאה', 
          detail: 'העלאת התמונה נכשלה!' 
        });
        console.error('Error upload image:', err);
      }
    });
  }

  updateGift() {
    const updateGiftWithImage = (imageUrl: string) => {
      const newGift: UpdateGift = {
        ...this.fromAddGift.value,
        id: this.gift?.id,
        image: imageUrl,
        value: Number(this.fromAddGift.value.value),
        // priceCard: Number(this.fromAddGift.value.priceCard),
        categoryId: Number(this.fromAddGift.value.categoryId),
        // typeCard: this.typeCardMap[this.fromAddGift.value.typeCard as keyof typeof this.typeCardMap]
      };

      this.giftService.updateGift(newGift).subscribe({
        next: (gift) => {
          console.log('Update gift successfully:', gift);
           this.messageService.add({ 
          severity: 'success', 
          summary: 'הצלחה', 
          detail: 'המתנה עודכנה בהצלחה!' 
        });
          this.fromAddGift.reset();
          this.selectedFile = null;
          this.router.navigate(['/gifts']);
        },
        error: (error: any) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'שגיאה', 
            detail: 'עדכון המתנה נכשל!' 
          });
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
        if (this.gift) {
          this.gift.image = fileUrl;
        }
        updateGiftWithImage(fileUrl);
      },
      error: (err: any) =>
        console.error('Error upload image:', err),
    });
  }


  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'add') {
      this.visible = true;
      this.fromAddGift.get('categoryId')?.setValue(null);
    }
  }

  addCategory() {
    console.log('נבחר: הוספת קטגוריה');
  }

  closeDialog() {
    this.visible = false;
  }

  save() {
    const name = this.newCategoryName.value;

    if (!name) {
      return;
    }
    const c: CreateCategory = { name: name };
    this.categoryService.createCategory(c).subscribe({
      next: (category) => {
        console.log('קטגוריה נוספה בהצלחה:', category);
        this.listCategory.push(category);
        this.fromAddGift.get('categoryId')?.setValue(category.id);
        this.newCategoryName.reset();
         this.messageService.add({ 
          severity: 'success', 
          summary: 'הצלחה', 
          detail: 'הזמנה בוצעה בהצלחה!' 
        });
      },
      error: (error) => {
        console.error('שגיאה בהוספת קטגוריה:', error);
      }
    });
    console.log('שם הקטגוריה:', name);

    this.closeDialog();
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
  }

  saveDonor() {
    const d = this.fromDonor.value;

    if (!this.fromDonor.valid) {
      return;
    }
    const donorData = this.fromDonor.value;
    this.donorService.createDonor(donorData).subscribe({
      next: (donor) => {
         this.messageService.add({ 
          severity: 'success', 
          summary: 'הצלחה', 
          detail: 'התורם נוסף בהצלחה!' 
        });
        console.log('Donor added successfully:', donor);
        this.listDonor.push(donor);
        this.fromAddGift.get('donorId')?.setValue(donor.id);
        this.fromDonor.reset();
      },
      error: (error) => {
        console.error('Error adding donor:', error);
         this.messageService.add({ 
          severity: 'error', 
          summary: 'שגיאה', 
          detail: 'שגיאה בהוספת התורם!' 
        });
      }
    });
    this.closeDialog1();
  }
  
}
