import { GetGift } from "./gift.model";
import { GetPackage } from "./package.model";

export class GetBasket {
    id!: number;
    userId!: number;
    sum!: number;
}

export class GetBasketById {
    id!: number;
    userId!: number;
    gifts?: GetGift[];
    packages?: GetPackage[];
    sum?: number;
}
export class CreateBasket {
    userId!: number;
}
export class AddGiftToBasket {
    basketId!: number;
    giftId!: number;
}
export class AddPackageToBasket {
    basketId!: number;
    packageId!: number;
}
export class RemoveGiftFromBasket {
    basketId!: number;
    giftId!: number;
}
export class RemovePackageFromBasket {
    basketId!: number;
    packageId!: number;
}
export interface MyDecodedToken {
    id: string;
    role: string;
    name: string; // שם המשתמש
    userName: string;      // שם מלא
    address: string;
    phone: string;
    email: string;
    nbf: number;
    exp: number;
    iat: number;
  }