export class GetUser {
    id!:number;
    userName!:string;
    name!:string;
    phone!:string;
    address?:string;
    email?:string;
    role!:Role;
}
export enum Role {
    Manager = 'Manager',
    Customer = 'Customer'
}
export class createUser {
    userName!:string;
    password!:string;
    name!:string;
    phone!:string;
    address?:string;
    email?:string;
    role!:Role;
}
export class loginUser {
    userName!:string;
    password!:string;
}