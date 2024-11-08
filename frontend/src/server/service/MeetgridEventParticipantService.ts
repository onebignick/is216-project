import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { MeetgridEventParticipantRepository } from "../repository/MeetgridEventParticipantRepository";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository";

export class MeetgridEventParticipantService {

    meetgridEventParticipantRepository: MeetgridEventParticipantRepository;
    meetgridEventRepository: MeetgridEventRepository

    constructor() {
        this.meetgridEventParticipantRepository = new MeetgridEventParticipantRepository();
        this.meetgridEventRepository = new MeetgridEventRepository();
    }

    async findAll() {
        const allEventParticipants = await this.meetgridEventParticipantRepository.findAll();
        return allEventParticipants;
    }

    async findById(id: string) {
        const targetEventParticipant = await this.meetgridEventParticipantRepository.findById(id);
        return targetEventParticipant;
    }

    async createOneEventParticipant(eventParticipantToCreate: MeetgridEventParticipant) {
        console.log("MeetgridEventParticipantService.createOneEventPartcipant: creating event participant")
        if (eventParticipantToCreate.availabilityString === "" && eventParticipantToCreate.eventId) {
            const targetEventArray = await this.meetgridEventRepository.findById(eventParticipantToCreate.eventId);
            if (targetEventArray.length == 0) throw new Error("Event does not exist");
            
            const targetEvent = targetEventArray[0];
            eventParticipantToCreate.availabilityString = this.generateAvailabilityString(new Date(targetEvent.startDate), new Date(targetEvent.endDate))
        }
        const createdEventParticipant = await this.meetgridEventParticipantRepository.createOne(eventParticipantToCreate);
        console.log("MeetgridEventParticipantService.createOneEventPartcipant: created event participant")
        return createdEventParticipant;
    }

    async updateOneEventParticipant(eventToUpdate: MeetgridEvent) {
        const updatedEvent = await this.meetgridEventParticipantRepository.updateOne(eventToUpdate);
        return updatedEvent;
    }

    async deleteOneEventParticipant(eventToDelete: MeetgridEvent) {
        const deletedEvent = await this.meetgridEventParticipantRepository.deleteOne(eventToDelete);
        return deletedEvent;
    }

    generateAvailabilityString(startDate: Date, endDate: Date) {
        const lengthOfEvent = (+endDate - +startDate) + 1;

        const availabilityArray = new Array(lengthOfEvent);
        for (let days=0; days<lengthOfEvent; days++) {
            availabilityArray[days] = new Array(96);
            for (let timeInterval=0; timeInterval<96; timeInterval++) {
                availabilityArray[days][timeInterval] = [];
            }
        }

        return JSON.stringify(availabilityArray);
    }
}