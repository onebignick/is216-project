import { MeetgridEvent } from "../entity/event";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository"

export class MeetgridEventService {

    meetgridEventRepository: MeetgridEventRepository;

    constructor() {
        this.meetgridEventRepository = new MeetgridEventRepository();
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
        eventToCreate.code = this.generateRandomCode();
        const createdEvent = await this.meetgridEventRepository.createOne(eventToCreate);
        return createdEvent;
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