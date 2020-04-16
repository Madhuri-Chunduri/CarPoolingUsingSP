export class User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    address?: string;

    constructor(id: string, name: string, email: string, mobile: string, password: string, address?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = mobile;
        this.password = password;
        this.address = address;
    }
}