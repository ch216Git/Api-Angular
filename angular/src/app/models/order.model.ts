import { GetGift } from "./gift.model";
import { GetPackage } from "./package.model";

export class GetOrder {
    id!: number;
    userId!: number;
    orderDate?: Date;
    sum!: number;
}

export class GetOrderById {
    id!: number;
    userId!: number;
    gifts?: GetGift[];
    packages?: GetPackage[];
    orderDate?: Date;
    sum?: number;
}
export class CreateOrder {
    userId!: number;
    giftsId?: number[];
    packagesId?: number[];
    orderDate?: Date;
    sum?: number;
}

// export interface MyDecodedToken {
//     id: string;
//     role: string;
//     name: string; // שם המשתמש
//     userName: string;      // שם מלא
//     address: string;
//     phone: string;
//     email: string;
//     nbf: number;
//     exp: number;
//     iat: number;
//   }