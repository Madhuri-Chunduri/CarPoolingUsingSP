import { Ride } from "./Ride";
import { User } from "./User";
import { Status } from "./Status";

export class Booking {
    id: string;
    ride: Ride;
    pickUp: string;
    drop: string;
    bookedBy: User;
    numberOfSeatsBooked: number;
    price: number;
    bookingTime: Date;
    status?: Status;

    constructor(id: string, rideId: string, pickUp: string, drop: string, bookedBy: string, numberOfSeats: number, price: number, bookingTime: Date, statusValue?: string) {
        this.ride = new Ride(rideId, null, null, null, 0, 0, new Date(), null);
        this.id = id;
        this.pickUp = pickUp;
        this.drop = drop;
        this.bookedBy = new User(bookedBy, null, null, null, null);
        this.numberOfSeatsBooked = numberOfSeats;
        this.price = price;
        this.bookingTime = bookingTime;
        this.status = new Status("-1", "Booking", statusValue);
    }
}