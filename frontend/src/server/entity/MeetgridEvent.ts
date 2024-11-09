export type MeetgridEvent = {
	id?: string;
	name: string;
	code?: string;
	description: string;
	startDate: string;
	endDate: string;
	startTimeMinutes: number;
	endTimeMinutes: number;
	meetingPeriod: number;
	backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
	dateCreated: string;
}