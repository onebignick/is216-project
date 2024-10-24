import { MeetgridBookEvent } from "../entity/booking";
import { BookEventRepository } from "../repository/booking-repository";

export class BookingService {
    BookEventRepository: BookEventRepository;

    constructor() {
        this.BookEventRepository = new BookEventRepository();
    }

    async getOneBookEventById(bookId: string) {
        try {
            console.log(bookId);
        } catch (e) {
            console.log(e.message);
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
}