import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";
import { MeetgridEventRegistrantRepository } from "../repository/MeetgridEventRegistrantRepository";

export class MeetgridEventRegistrantService {

    meetgridEventRegistrantRepository: MeetgridEventRegistrantRepository;

    constructor() {
        this.meetgridEventRegistrantRepository = new MeetgridEventRegistrantRepository();
    }

    async createOneEventRegistrant(meetgridEventRegistrantToCreate: MeetgridEventRegistrant) {
        const createdMeetgridEventRegistrant = await this.meetgridEventRegistrantRepository.createOne(meetgridEventRegistrantToCreate);
        return createdMeetgridEventRegistrant;
    }

}