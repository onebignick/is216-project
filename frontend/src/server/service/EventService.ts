import { MeetgridEvent } from "../entity/event";
import { EventRepository } from "../repository/event-repository";

export class EventService {
    eventRepository: EventRepository;

    constructor() {
        this.eventRepository = new EventRepository();
    }

    // Generates a unique random 6-character code
    generateRandomCode(): string {
        const chr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        const min = 0;
        const max = chr.length;

        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * (max - min) + min); // generates random index
            code += chr[index]; // adds character to the code
        }
        console.log('Generated code:', code);
        return code;
    }

    async getOneEventById(eventId: string) {
        try {
            const eventInformation = await this.eventRepository.getById(eventId);
            return eventInformation;
        } catch (e) {
            console.log(e.message);
        }
    }
    
    async getAllEventsRelatedToUser(userId: string) {
        try {
            return await this.eventRepository.getAllEventsRelatedToUser(userId)
        } catch (e) {
            console.log(e.message);
            return [];
        }
    }

    async getUserRecentEventActivity(userId: string) {
        try {
            return await this.eventRepository.getRecentEventActivityRelatedToUser(userId);
        } catch (e) {
            console.log(e.message);
            return []
        }
    }

    // Checks if the generated code is unique
    async isCodeUnique(code: string): Promise<boolean> {
        try {
            const existingEvent = await this.eventRepository.getEventByCode(code);
            return !existingEvent; // if no event exists with the code, it's unique
        } catch (e) {
            console.log("Error checking code uniqueness:", e.message);
            return false;
        }
    }

    // async createOneEvent(newEvent: MeetgridEvent) {
    //     try {
    //         const result = await this.eventRepository.createOne(newEvent);
    //         if (result.length == 0) {
    //             console.log("Failed to create event")
    //             return ""
    //         } else {
    //             console.log("Event created successfully")
    //             // return the unique code here too
    //             // add to check if code is actually unique?
    //             let unique_code = this.generateRandomCode();
    //             console.log(unique_code);
    //             return { id: result[0].id, code: unique_code };
    //         }
    //     } catch (e) {
    //         console.log(e.message);
    //         return ""
    //     }
    // }

     // Creates a new event and ensures the code is unique
     async createOneEvent(newEvent: MeetgridEvent) {
        try {
            let unique_code: string;
            let isUnique = false;

            // Keep generating a new code until it's unique
            do {
                unique_code = this.generateRandomCode();
                isUnique = await this.isCodeUnique(unique_code);
            } while (!isUnique);

            // Assign the unique code to the event
            newEvent.eventCode = unique_code;

            // Attempt to create the event in the repository
            const result = await this.eventRepository.createOne(newEvent);

            if (result.length === 0) {
                console.log("Failed to create event");
                return "";
            } else {
                console.log("Event created successfully:", result[0].id);
                return { id: result[0].id, code: unique_code };
            }
        } catch (e) {
            console.log("Error creating event:", e.message);
            return "";
        }
    }
}