export type MeetgridQuestions = {
    id?: string;
    name?: string | null;
    questions: string;
    eventId: string;
    createdAt?: Date;
    updatedAt?: string | null;
}