import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { RegisterComponent } from '../user/register-component/register-component';

@Component({
    selector: 'app-header-component',
    imports: [RouterModule, Menubar,RegisterComponent],
    templateUrl: './header-component.html',
    styleUrl: './header-component.scss',
})
export class HeaderComponent {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'הפרסים',
                routerLink: ['/gifts'],
            },
            {
                label: 'רישום',
                routerLink: ['/register'],
            },
            {
                label: 'התחברות',
                routerLink: ['/login'],
            },
            {
                label: 'הוספת מתנה',
                routerLink: ['/addGift'],
            }, {
                label: 'החבילות',
                routerLink: ['/package'],
            },
            {
                label: 'התורמים',
                routerLink: ['/donor'],
            },
             {
                label: 'הגרלות',
                routerLink: ['/prize'],
            }
        ]
    }
}
