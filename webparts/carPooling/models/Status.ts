export class Status {
    id: string;
    type: string;
    value: string;

    constructor(id: string, type: string, value: string) {
        this.id = id;
        this.type = type;
        this.value = value;
    }
}