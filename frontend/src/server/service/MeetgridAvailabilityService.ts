import { auth } from "@clerk/nextjs/server";
import { MeetgridAvailability } from "../entity/availability";
import { MeetgridAvailabilityRepository } from "../repository/MeetgridAvailability-repository";
import { EventRepository } from "../repository/event-repository";

export class MeetGridAvailabilityService {
    meetgridAvailabilityRepository: MeetgridAvailabilityRepository;
    eventRepository: EventRepository;

    constructor() {
        this.meetgridAvailabilityRepository = new MeetgridAvailabilityRepository();
        this.eventRepository = new EventRepository();
    }

    async getUserToEventMeetgridAvailability(userId: string, eventId: string) {
        const result = await this.meetgridAvailabilityRepository.getUserToEventAvailability(userId, eventId);
        return result;
    }

    async getTotalEventAvailability(eventId: string) {
        const eventInformation = await this.eventRepository.getById(eventId);

        if (eventInformation.length == 0) { throw new Error("event does not exist"); }
        const currentEvent = eventInformation[0];
        const startDate: Date = new Date(currentEvent.startDate!);
        const endDate: Date = new Date(currentEvent.endDate!);
        const interval = (+endDate- +startDate) / (1000 * 60 * 15) + 96;

        const result = Array(interval).fill(0);

        const availabilities = await this.meetgridAvailabilityRepository.getEventAvailability(eventId);
        if (availabilities.length == 0) { return result; }

        for (let i=0;i<availabilities.length;i++) {
            const curAvailability = availabilities[i].availabilityString!.split(",");
            
            for (let j=0;j<curAvailability.length;j++) {
                if (curAvailability[j] != "0") {
                    result[j]++;
                }
            }
        }
        return result;
    }

    async createUserToEventMeetgridAvailability(meetGridAvailability: MeetgridAvailability) {
        const user = auth();
        meetGridAvailability.clerkUserId = user.userId;
        const result = await this.meetgridAvailabilityRepository.createOne(meetGridAvailability);
        return result;
    }

    async updateUserToEventMeetgridAvailability(updatedMeetgridAvailability: MeetgridAvailability) {
        const result = await this.meetgridAvailabilityRepository.updateOne(updatedMeetgridAvailability.id!, updatedMeetgridAvailability);
        return result;
    }
}