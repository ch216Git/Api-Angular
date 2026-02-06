import { Routes } from '@angular/router';
import { RegisterComponent } from './components/user/register-component/register-component';
import { LoginComponent } from './components/user/login-component/login-component';
import { GiftComponent } from './components/gift/gift-component/gift-component';
import { GiftIdComponent } from './components/gift/gift-id-component/gift-id-component';
import { AddGiftComponent } from './components/gift/add-gift-component/add-gift-component';
import { PackageComponent } from './components/package-component/package-component';
import { DonorComponent } from './components/donor-component/donor-component';
import { PrizeComponent } from './components/prize-component/prize-component';

export const routes: Routes = [
    { path: '', redirectTo: 'package', pathMatch: 'full' }, // ⭐ ברירת מחדל
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'gifts', component: GiftComponent },
    { path: 'gift/:id', component: GiftIdComponent },
    { path: 'addGift', component: AddGiftComponent },
    { path: 'editGift/:id', component: AddGiftComponent },
    { path: 'package', component: PackageComponent },
    { path: 'donor', component: DonorComponent },
     { path: 'prize', component: PrizeComponent },
    { path: '**', redirectTo: 'package' }
  ];
  
