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
}