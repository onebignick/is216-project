import { NextResponse } from "next/server";
import { BookingService } from "../service/BookingService";

export class BookingController {
    BookingService: BookingService;

    constructor() {
        this.BookingService = new BookingService();
    }

    async handleBookEventCreation(request: Request) {
        try {
            const newBookEvent = await request.json();

            // Proceed with creating the event
            const result = await this.BookingService.createOneBookEvent(newBookEvent);
            return NextResponse.json({ message: "success",  eventCode: newBookEvent.eventCode, result: result}, { status: 200 })
            
        } catch {
            return NextResponse.json({ message: "An Error occured"}, { status: 500 })
        }
    }

    async handleGetAllBookingEventsOrganizedByUser(request: Request) {
        try {
            const userIdRequest = await request.json();
            const results = this.BookingService.getAllBookEventsOrganizedByUser(userIdRequest);
            return NextResponse.json({message: "success", result: results}, {status: 200});
        } catch {
            return NextResponse.json({message: "An error occured"}, {status: 500});
        }
    }

    // New method to handle event deletion
    async handleDeleteBookEvent(eventId: string, request: Request) {
        try {
            // Check if eventId is valid (you can add additional validation if necessary)
            if (!eventId) {
                return NextResponse.json({ message: "Book ID is required" }, { status: 400 });
            }
    
            const result = await this.BookingService.deleteById(eventId); // Call to service to delete the event
    
            if (result) {
                return NextResponse.json({ message: "Book Event deleted successfully" }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Book Event not found" }, { status: 404 });
            }
    
        } catch (error) {
            console.error("Error deleting book event:", error);
            return NextResponse.json({ message: "An error occurred while deleting the book event" }, { status: 500 });
        }
    }

}