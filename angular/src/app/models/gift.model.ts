import { GetCategory } from './category.model';
import { GetDonor } from './donor.model';
import { GetUser } from './user.model';
// export enum TypeCard {
//     Special = 'Special',
//     Normal= 'Normal'
// }
export class GetGift {
    id!: number;
    name!: string;
    description?: string;
    image?: string;
    value?: number;
    // priceCard!: number;
    category!: GetCategory;
    donor!: GetDonor;
    // typeCard?: TypeCard;
    sumCustomers?: number;
}
export class CreateGift {
    name!: string;
    description?: string;
    image?: string;
    value?: number;
    // priceCard!: number;
    categoryId!: number;
    donorId!: number;
    // typeCard?: TypeCard;
}
export class UpdateGift {
    id!: number;
    name!: string;
    description?: string;
    image?: string;
    value?: number;
    // priceCard!: number;
    categoryId!: number;
    donorId!: number;
    // typeCard?: TypeCard;
}
export interface GiftWithWinner extends GetGift {
  winner?: GetUser | null;
}
