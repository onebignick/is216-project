import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { MeetgridEventParticipantRepository } from "../repository/MeetgridEventParticipantRepository";

export class MeetgridEventParticipantService {

    meetgridEventParticipantRepository: MeetgridEventParticipantRepository;

    constructor() {
        this.meetgridEventParticipantRepository = new MeetgridEventParticipantRepository();
    }

    async findAll() {
        const allEvents = await this.meetgridEventParticipantRepository.findAll();
        return allEvents;
    }

    async findById(id: string) {
        const targetEvent = await this.meetgridEventParticipantRepository.findById(id);
        return targetEvent;
    }

    async createOneEventParticipant(eventParticipantToCreate: MeetgridEventParticipant) {
        if (eventParticipantToCreate.availabilityString === "") {
            console.log("aaaa");
        }
        const createdEventParticipant = await this.meetgridEventParticipantRepository.createOne(eventParticipantToCreate);
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

}