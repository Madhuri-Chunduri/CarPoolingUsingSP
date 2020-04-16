export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    PickUp: string;
    Drop: string;
    StartDate: Date;
    Price: number;
}