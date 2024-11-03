export type MeetgridEvent = {
    id?: string;
    name: string | null;
    eventCode: string | null;
    description: string | null;
    createdBy: string | null;
    startDate: string | null;
    endDate: string | null;
    startTime?: number | null;
    endTime?: number | null;
    interval?: number | null;
    reminder: Date | null;
    participantNum: string | null;
    eventAvailability?: string;
}