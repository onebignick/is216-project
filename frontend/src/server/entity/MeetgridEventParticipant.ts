export type MeetgridEventParticipant = {
    id?: string;
    eventId: string;
    userId: string;
    role: "owner" | "admin" | "participant";
    availabilityString: string;
}