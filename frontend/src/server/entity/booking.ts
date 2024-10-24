export type MeetgridBookEvent = {
    id?: string;
    name: string | null;
    date: string | null;
    time: Date | null;
    notes: string | null;
    status: string | null;
    participantId: string | null; 
    eventCode: string | null;
}