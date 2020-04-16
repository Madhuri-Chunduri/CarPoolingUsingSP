export class ViaPoint {
    id: string;
    rideId: string;
    name: string;
    index: number;
    distance: number;

    constructor(id: string, rideId: string, name: string, index: number, distance: number) {
        this.id = id;
        this.rideId = rideId;
        this.name = name;
        this.index = index;
        this.distance = distance;
    }
}