export class GetPackage{
    id!:number;
    name!:string;
    price!:number;
    description?:string;
    countCard!:number;
    // CountNormalCard?:number;
}
export class CreatePackage{
    name!:string;
    price!:number;
    description?:string;
    countCard!:number;
    // CountNormalCard?:number;
}
export class UpdatePackage{
    id!:number;
    name!:string;
    price!:number;
    description?:string;
    countCard?:number;
    // CountNormalCard?:number;
}
export interface PackageVM extends GetPackage {
    imageUrl: string;
  }