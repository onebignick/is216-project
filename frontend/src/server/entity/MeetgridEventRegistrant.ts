export type MeetgridEventRegistrant = {
    id?: string,
    eventId: string,
    interviewerEmail: string,
    participantEmail: string,
    timeslotIdx: number,
    dayIdx: number,
    zoomLink: string,
}