// import { Component, inject, ChangeDetectorRef, signal } from '@angular/core';
// import { DonorService } from '../../services/donor-service';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { CardModule } from 'primeng/card';
// import { GetDonor, GetDonorById } from '../../models/donor.model';
// import { ButtonModule } from 'primeng/button';
// import { DialogModule } from 'primeng/dialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { email } from '@angular/forms/signals';
// import { Router, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-donor-component',
//   imports: [ReactiveFormsModule, CommonModule, FormsModule, CardModule, ButtonModule, DialogModule, InputTextModule, RouterLink],
//   templateUrl: './donor-component.html',
//   styleUrl: './donor-component.scss',
// })
// export class DonorComponent {
//   constructor(private router: Router) { }
//   donorService: DonorService = inject(DonorService);
//   cd: ChangeDetectorRef = inject(ChangeDetectorRef);
//   fromDonor: FormGroup = new FormGroup({
//     name: new FormControl('', Validators.required),
//     email: new FormControl('', Validators.email),
//     phone: new FormControl('', Validators.pattern('^\\+?[0-9]{10,12}$')),

//   })
//   allDonor: GetDonor[] = []
//   allDonorWithGift: GetDonorById[] = []
//   visible: boolean = false;
//   selectedDonor: any = { name: '', email: '', phone: '' };
//   cuurentRoute:string="";
//   donorById:GetDonorById|undefined;
//   selectedValue = signal('');
//     nameSignal = signal('');
//   search="";

//   ngOnInit() {
//     this.getAllDonor();
//     this.cuurentRoute=this.router.url;
//     if(this.cuurentRoute.startsWith('/donor/') && this.cuurentRoute.length > '/donor/'.length){
//       const id = +this.cuurentRoute.substring('/donor/'.length);
//       this.donorService.getDonorById(id).subscribe(data => {
//         this.donorById = data;
//         console.log(this.donorById);
//         this.cd.markForCheck();
//       });
//     }
//   }

// onChange(event: Event) {
//   const select = event.target as HTMLSelectElement;
//   this.selectedValue.set(select.value);
//   console.log(this.selectedValue());
//   this.runAction();
// }
// runAction() {
//   if (this.selectedValue() === 'sortByName') {
//     this.donorService.SearchByName(this.nameSignal()).subscribe(data => {
//       this.allDonorWithGift = data;
//       console.log(this.allDonor);
//       this.cd.markForCheck();
//     });
//   }
//   else if (this.selectedValue() === 'sortByEmail') {
//     this.donorService.SearchByEmail(this.nameSignal()).subscribe(data => {
//       this.allDonorWithGift = data;
//       console.log(this.allDonor);
//       this.cd.markForCheck();
//     });
//   }
// }

//   showDialog() {
//     this.visible = true;
//   }
//   addDonor() {
//     const donorData = this.fromDonor.value;
//     this.donorService.createDonor(donorData).subscribe({
//       next: (donor) => {
//         console.log('Donor added successfully:', donor);
//         this.fromDonor.reset();
//         this.cd.markForCheck();
//       },
//       error: (error) => {
//         console.error('Error adding donor:', error);
//       }
//     });
//   }
//   getAllDonor() {
//     this.donorService.getAllDonor().subscribe(data => {
//       this.allDonor = data
//       console.log(this.allDonor);
//       for (let i = 0; i < this.allDonor.length; i++) {
//         this.donorService.getDonorById(this.allDonor[i].id).subscribe(c => {
//           this.allDonorWithGift.push(c);
//           this.cd.markForCheck();
//         })
//       }

//     })
//   }

//   editDonor(donor: any) {
//     this.selectedDonor = { ...donor }; // העתק כדי לא לשנות את המקורי מיד
//     this.visible = true;
//   }
// saveDonor(idDonor: number) {
//   const updateDonor = {
//     id: idDonor,
//     name: this.selectedDonor.name,
//     email: this.selectedDonor.email,
//     phone: this.selectedDonor.phone
//   };

//   this.donorService.updateDonor(updateDonor).subscribe({
//     next: (donor) => {
//       // עדכון רשימת allDonor
//       const donorIndex = this.allDonor.findIndex(d => d.id === idDonor);
//       if (donorIndex !== -1) {
//         this.allDonor[donorIndex] = { ...this.allDonor[donorIndex], ...this.selectedDonor };
//       }

//       // עדכון רשימת allDonorWithGift לפי ID ולא אינדקס
//       this.allDonorWithGift = this.allDonorWithGift.map(d => {
//         if (d.id === idDonor) {
//           return { ...d, ...this.selectedDonor }; // שומר את ה-gifts
//         }
//         return d;
//       });

//       // איפוס וסגירת דיאלוג
//       this.selectedDonor = { name: '', email: '', phone: '' };
//       this.visible = false;
//       this.cd.markForCheck();
//     },
//     error: (error) => console.error('Error update donor:', error)
//   });
// }

//   deleteDonor(idDonor:number){
//     this.donorService.deleteDonor(idDonor).subscribe(
//       {next: () => {

//       this.allDonorWithGift = this.allDonorWithGift.filter(d => d.id !== idDonor);
//       this.allDonor = this.allDonor.filter(d => d.id !== idDonor);
//       this.cd.markForCheck();

//     },
//     error: err => {
//       console.error("Error deleting donor", err);
//     }})
//   }
// }
import { Component, inject, ChangeDetectorRef, signal, effect } from '@angular/core';
import { DonorService } from '../../services/donor-service';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { GetDonor, GetDonorById } from '../../models/donor.model';

@Component({
  selector: 'app-donor-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, CardModule, ButtonModule, DialogModule, InputTextModule, RouterLink],
  templateUrl: './donor-component.html',
  styleUrls: ['./donor-component.scss'],
})
export class DonorComponent {
  donorService: DonorService = inject(DonorService);
  cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  router: Router = inject(Router);



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
    // this.runAction();
  }

  // runAction() {
  //   if (this.selectedValue() === 'sortByName') {
  //     this.donorService.SearchByName(this.nameSignal()).subscribe(data => {
  //       this.allDonorWithGift.set(data);
  //       this.cd.markForCheck();
  //     });
  //   } else if (this.selectedValue() === 'sortByEmail') {
  //     this.donorService.SearchByEmail(this.nameSignal()).subscribe(data => {
  //       this.allDonorWithGift.set(data);
  //       this.cd.markForCheck();
  //     });
  //   }
  // }

  showDialog() {
    this.visible = true;
  }



  getAllDonor() {
    this.donorService.getAllDonor().subscribe(data => {
      this.allDonor.set(data);
      this.allDonorWithGift.set([]);

      this.allDonorWithGift.set([]); // ריק לפני שמוסיפים
      data.forEach(donor => {
        this.donorService.getDonorById(donor.id).subscribe(c => {
          // הוסף לבדיקה שלא קיים כבר
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
      },
      error: (error) => console.error('Error update donor:', error)
    });
  }

  deleteDonor(idDonor: number) {
    this.donorService.deleteDonor(idDonor).subscribe({
      next: () => {
        this.allDonor.set(this.allDonor().filter(d => d.id !== idDonor));
        this.allDonorWithGift.set(this.allDonorWithGift().filter(d => d.id !== idDonor));
        this.cd.markForCheck();
      },
      error: (err) => console.error("Error deleting donor", err)
    });
  }
}
