import { Vehicle } from "./Vehicle";
import { User } from "./User";
import { Status } from "./Status";

export class Ride {
    id: string;
    publisher: User;
    pickUp: string;
    drop: string;
    numberOfSeats: number;
    price: number;
    startDate: Date;
    Vehicle: Vehicle;
    Status?: Status;
    availableSeats?: number;

    constructor(id: string, publisherId: string, pickUp: string, drop: string, numberOfSeats: number, price: number, startDate: Date, vehicleId: string, statusValue?: string, availableSeats?: number) {
        this.publisher = new User(publisherId, null, null, null, null);
        this.Vehicle = new Vehicle(vehicleId, null, null, null);
        this.id = id;
        // this.publisher.id = publisherId;
        this.pickUp = pickUp;
        this.drop = drop;
        this.numberOfSeats = numberOfSeats;
        this.price = price;
        this.startDate = startDate;
        this.Status = new Status("-1", "Ride", statusValue);
        this.availableSeats = availableSeats;
        // this.Vehicle.id = vehicleId;
    }
}