export type MeetgridNote = {
    id?: string;
    name: string;
    content: string;
    bookingId?: string | null;
    createdAt?: Date;
    updatedAt?: string | null;
}