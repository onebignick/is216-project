export type MeetgridEvent = {
    id?: string;
    name: string | null;
    description: string | null;
    organizerId: string | null;
    startDate: string | null;
    endDate: string | null;
    reminder: Date | null;
}