import { auth } from "@clerk/nextjs/server";
import { MeetgridEvent } from "../entity/MeetgridEvent";
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository"
import { MeetgridEventParticipantService } from "./MeetgridEventParticipantService";

export class MeetgridEventService {

    meetgridEventRepository: MeetgridEventRepository;
    meetgridEventParticipantService: MeetgridEventParticipantService;

    constructor() {
        this.meetgridEventRepository = new MeetgridEventRepository();
        this.meetgridEventParticipantService = new MeetgridEventParticipantService();
    }

    async findAll() {
        const allEvents = await this.meetgridEventRepository.findAll();
        return allEvents;
    }

    async findById(id: string) {
        const targetEvent = await this.meetgridEventRepository.findById(id);
        return targetEvent;
    }

    async createOneEvent(eventToCreate: MeetgridEvent) {
        
        const user = auth();

        eventToCreate.code = this.generateRandomCode();
        const createdEventArray = await this.meetgridEventRepository.createOne(eventToCreate);

        if (createdEventArray.length == 0) return createdEventArray;

        const createdEvent = createdEventArray[0]

        if (createdEvent.id) {
            const eventParticipantToCreate = {
                eventId: createdEvent.id,
                userId: user.userId,
                role: "owner",
                availabilityString: "",
            } as MeetgridEventParticipant
            const createdEventParticipant = await this.meetgridEventParticipantService.createOneEventParticipant(eventParticipantToCreate);
            console.log(createdEventParticipant);
        }

        return createdEventArray;
    }

    async updateOneEvent(eventToUpdate: MeetgridEvent) {
        const updatedEvent = await this.meetgridEventRepository.updateOne(eventToUpdate);
        return updatedEvent;
    }

    async deleteOneEvent(eventToDelete: MeetgridEvent) {
        const deletedEvent = await this.meetgridEventRepository.deleteOne(eventToDelete);
        return deletedEvent;
    }

    // helper function to generate random 6-character code
    generateRandomCode(): string {
        console.log("MeetgridEventService.generateRandomCode: generating random code")
        const chr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        const min = 0;
        const max = chr.length;

        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * (max - min) + min); // generates random index
            code += chr[index]; // adds character to the code
        }
        
        console.log("MeetgridEventService.generateRandomCode: generated random code with value " + code)
        return code;
    }

}