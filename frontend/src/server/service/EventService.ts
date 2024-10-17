import { MeetgridEvent } from "../entity/event";
import { EventRepository } from "../repository/event-repository";

export class EventService {
    eventRepository: EventRepository;

    constructor() {
        this.eventRepository = new EventRepository();
    }

    generateRandomCode(): string{
        const chr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        const min = 0;
        const max = chr.length;
        for(let i = 0;i<6;i++){
            const index = Math.floor(Math.random() * (max-min) + min); //generates random index
            code += chr[index]; //adds chr into code lol
        }
        console.log('generated code');
        return code;
    }

    async getOneEventById(eventId: string) {
        try {
            console.log(eventId);
        } catch (e) {
            console.log(e.message);
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

    async createOneEvent(newEvent: MeetgridEvent) {
        try {
            const result = await this.eventRepository.createOne(newEvent);
            if (result.length == 0) {
                console.log("Failed to create event")
                return ""
            } else {
                console.log("Event created successfully")
                // return the unique code here too
                // add to check if code is actually unique?
                let unique_code = this.generateRandomCode();
                return {id: result[0].id, code:unique_code};
            }
        } catch (e) {
            console.log(e.message);
            return ""
        }
    }
}