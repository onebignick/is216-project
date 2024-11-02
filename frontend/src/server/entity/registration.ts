export type Registration = {
    id?: string;
    userId?: string;
    eventId: string;
    role: "admin" | "organizer" | "attendee";
}