import { GetGift } from "./gift.model";

export class GetCategory {
    id!: number;
    name!: string;
}
export class CreateCategory {
    name!: string;
}
export class UpdateCategory {
    id!: number;
    name!: string;
}
export class DeleteCategory {
    id!: number;
}
export class GetCategoryById {
    id!: number;
    name!: string;
    gifts?:GetGift[];
}