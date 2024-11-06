import { MeetgridBookEvent } from "../entity/booking";
import { BookEventRepository } from "../repository/booking-repository";

export class BookingService {
    BookEventRepository: BookEventRepository;

    constructor() {
        this.BookEventRepository = new BookEventRepository();
    }

    async getOneBookEventById(eventCode: string) {
        try {
            console.log("Fetching event with code:", eventCode);
            const bookingEvent = await this.BookEventRepository.getEventByCode(eventCode);
            if (!bookingEvent) {
                console.log("No event found with this code:", eventCode);
                return null;
            }
            console.log("Event found:", bookingEvent);
            return bookingEvent;
        } catch (e) {
            console.log("Error fetching booking event:", e.message);
            return null;
        }
    }
    
    async getAllBookEventsOrganizedByUser(userId: string) {
        try {
            return await this.BookEventRepository.getAllBookEventsOrganizedByUser(userId)
        } catch (e) {
            console.log(e.message);
            return [];
        }
    }

     // Creates a new event and ensures the code is unique
     async createOneBookEvent(newBookEvent: MeetgridBookEvent) {
        try {

            // Attempt to create the event in the repository
            const result = await this.BookEventRepository.createOne(newBookEvent);

            if (result.length === 0) {
                console.log("Failed to book event");
                return "";
            } else {
                console.log("Event booked successfully:", result[0].id);
                return { id: result[0].id};
            }
        } catch (e) {
            console.log("Error boook event:", e.message);
            return "";
        }
        
    }

    async deleteById(bookId: string): Promise<boolean> {
        try {
            const deletedEvents = await this.BookEventRepository.deleteOne(bookId);
            return deletedEvents.length > 0; // Return true if at least one event was deleted
        } catch (e) {
            console.log("Error deleting event in repository:", e.message);
            return false; // Return false if an error occurs
        }
    }
    
}