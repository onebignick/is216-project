import { MeetgridEvent } from "../entity/event";
import { EventRepository } from "../repository/event-repository";

export class EventService {
    eventRepository: EventRepository;

    constructor() {
        this.eventRepository = new EventRepository();
    }

    async createOneEvent(newEvent: MeetgridEvent) {
        try {
            const result = await this.eventRepository.createOne(newEvent);
            if (result.length == 0) {
                console.log("Failed to create event")
                return ""
            } else {
                console.log("Event created successfully")
                return result[0].id;
            }
        } catch (e) {
            console.log(e.message);
            return ""
        }
    }

    async getAllEventsOrganizedByUser(userId: string) {
        try {
            return await this.eventRepository.getAllEventsOrganizedByUser(userId)
        } catch (e) {
            console.log(e.message);
            return [];
        }
    }
}