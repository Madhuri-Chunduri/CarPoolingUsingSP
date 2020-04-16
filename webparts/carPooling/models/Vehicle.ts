export class Vehicle {
    id: string;
    model: string;
    number: string;
    userId: string;

    constructor(id: string, userId: string, model: string, number: string) {
        this.id = id;
        this.userId = userId;
        this.model = model;
        this.number = number;
    }
}