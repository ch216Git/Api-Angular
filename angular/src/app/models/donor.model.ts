import { GetGift } from "./gift.model";

export class GetDonor {
    id!: number;
    name!: string;
    phone?: string;
    email?: string;
}
export class GetDonorById {
    id!: number;
    name!: string;
    phone?: string;
    email?: string;
    gifts?:GetGift[];
}
export class CreateDonor {
    name!: string;
    phone?: string;
    email?: string;
}
export class UpdateDonor {
    id!: number;
    name!: string;
    phone?: string;
    email?: string;
}