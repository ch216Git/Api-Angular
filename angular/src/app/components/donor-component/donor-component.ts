import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { DonorService } from '../../services/donor-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { GetDonor, GetDonorById } from '../../models/donor.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-donor-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, CardModule, ButtonModule, DialogModule, InputTextModule],
  templateUrl: './donor-component.html',
  styleUrl: './donor-component.scss',
})
export class DonorComponent {
  donorService: DonorService = inject(DonorService);
  cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  fromDonor: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl('', Validators.pattern('^\\+?[0-9]{10,12}$')),

  })
  allDonor: GetDonor[] = []
  allDonorWithGift: GetDonorById[] = []
  visible: boolean = false;
  selectedDonor: any = { name: '', email: '', phone: '' };



  ngOnInit() {
    this.getAllDonor();
  }
  showDialog() {
    this.visible = true;
  }
  addDonor() {
    const donorData = this.fromDonor.value;
    this.donorService.createDonor(donorData).subscribe({
      next: (donor) => {
        console.log('Donor added successfully:', donor);
        this.fromDonor.reset();
        this.cd.markForCheck();
      },
      error: (error) => {
        console.error('Error adding donor:', error);
      }
    });
  }
  getAllDonor() {
    this.donorService.getAllDonor().subscribe(data => {
      this.allDonor = data
      console.log(this.allDonor);
      for (let i = 0; i < this.allDonor.length; i++) {
        this.donorService.getDonorById(this.allDonor[i].id).subscribe(c => {
          this.allDonorWithGift.push(c);
          this.cd.markForCheck();
        })
      }

    })
  }

  editDonor(donor: any) {
    this.selectedDonor = { ...donor }; // העתק כדי לא לשנות את המקורי מיד
    this.visible = true;
  }
  saveDonor(idDonor: number) {
    console.log(idDonor);
    
    const updateDonor = {
      id: idDonor,
      name: this.selectedDonor.name,
      email: this.selectedDonor.email,
      phone: this.selectedDonor.phone
    }

    this.donorService.updateDonor(updateDonor).subscribe({
      next: (donor) => {
        // עדכון התורם במערך
        const index = this.allDonor.findIndex(d => d.id === idDonor);
        if (index !== -1) {
          this.allDonor[index] = { ...this.selectedDonor, id: idDonor };
          const updatedDonor = { ...this.selectedDonor, id: idDonor, gifts: this.allDonorWithGift[index].gifts };

          this.allDonorWithGift = [
            ...this.allDonorWithGift.slice(0, index),
            updatedDonor,
            ...this.allDonorWithGift.slice(index + 1)
          ];
        }

        // איפוס וסגירת דיאלוג
        this.selectedDonor = { name: '', email: '', phone: '' };
        this.visible = false;
        this.cd.markForCheck();
      },
      error: (error: any) => console.error('Error update donor:', error)
    });
    this.visible = false;
  }
  deleteDonor(idDonor:number){
    this.donorService.deleteDonor(idDonor).subscribe(
      {next: () => {
   
      this.allDonorWithGift = this.allDonorWithGift.filter(d => d.id !== idDonor);
      this.allDonor = this.allDonor.filter(d => d.id !== idDonor);
      this.cd.markForCheck();

    },
    error: err => {
      console.error("Error deleting donor", err);
    }})
  }
}
