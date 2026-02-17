import { Component, inject, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { RegisterComponent } from '../user/register-component/register-component';
import { jwtDecode } from 'jwt-decode';
import { MyDecodedToken } from '../../models/basket.model';

// ודאי שהנתיב כאן תואם למבנה התיקיות שלך:
import { BasketService } from '../../services/basket-service'; 
import { UserService } from '../../services/userService';

@Component({
    selector: 'app-header-component',
    standalone: true,
    imports: [RouterModule, Menubar, RegisterComponent, BadgeModule],
    templateUrl: './header-component.html',
    styleUrl: './header-component.scss',
})
export class HeaderComponent {
    basketService:BasketService = inject(BasketService);

    userService:UserService = inject(UserService);

    items = computed<MenuItem[]>(() => {
        const role = this.userService.userRole(); 

        return [
            { label: 'הפרסים', routerLink: ['/gifts'], icon: 'pi pi-gift' },
            { label: 'החבילות', routerLink: ['/package'], icon: 'pi pi-box' },
            { label: 'התורמים', routerLink: ['/donor'], icon: 'pi pi-users' },
            { 
                label: 'הוספת מתנה', 
                routerLink: ['/addGift'], 
                visible: role === 'Manager',
                icon: 'pi pi-plus-circle'
            },
            { 
                label: 'הגרלות', 
                routerLink: ['/prize'], 
                visible: role === 'Manager',
                icon: 'pi pi-verified'
            },
            { label: 'רישום', routerLink: ['/register'], icon: 'pi pi-user-plus', visible: !role },
            { label: 'התחברות', routerLink: ['/login'], icon: 'pi pi-sign-in', visible: !role },
            { label: 'התנתקות', icon: 'pi pi-sign-out', visible: !!role, command: () => this.logout() }
        ];
    });

    logout() {
        localStorage.removeItem('token');
        this.basketService.clearBasket();
        this.userService.refreshRole(); 
    }
}