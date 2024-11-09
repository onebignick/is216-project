export type MeetgridAssociatedEvent = {
    id: string;
    name: string;
    description: string;
    dateCreated: Date;
    role: "owner" | "admin" | "participant";
    startDate: Date;
    endDate: Date;
}