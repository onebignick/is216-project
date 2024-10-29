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
}