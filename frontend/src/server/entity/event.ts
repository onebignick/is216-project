export type MeetgridEvent = {
    id?: string;
    name: string | null;
    description: string | null;
    organizerId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    reminder: Date | null;
}