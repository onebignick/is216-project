export type MeetgridEventParticipant = {
    id?: string;
    eventId: string;
    userId: string;
    role: string;
    availabilityString: string;
}