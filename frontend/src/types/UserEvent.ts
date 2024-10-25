export type UserEvent = {
    userClerkId: string;
    eventId: string;
    role: "admin" | "organizer" | "attendee";
}