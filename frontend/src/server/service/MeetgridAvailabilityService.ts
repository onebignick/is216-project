import { auth } from "@clerk/nextjs/server";
import { MeetgridAvailability } from "../entity/availability";
import { MeetgridAvailabilityRepository } from "../repository/MeetgridAvailability-repository";

export class MeetGridAvailabilityService {
    meetgridAvailabilityRepository: MeetgridAvailabilityRepository;

    constructor() {
        this.meetgridAvailabilityRepository = new MeetgridAvailabilityRepository();
    }

    async getUserToEventMeetgridAvailability(userId: string, eventId: string) {
        const result = await this.meetgridAvailabilityRepository.getUserToEventAvailability(userId, eventId);
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