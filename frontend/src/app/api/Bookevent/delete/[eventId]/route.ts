import { BookingController } from "@/server/controller/BookingController";
import { NextResponse } from "next/server";

const bookingController: BookingController = new BookingController()

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        console.log("Requested URL:", url.pathname); // Log to check if eventId is correctly parsed
        const eventId = url.pathname.split("/").pop(); // Get the eventId from the URL

        if (!eventId) {
            return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
        }

        // Pass the event ID to the controller's delete method
        return await bookingController.handleDeleteBookEvent(eventId, request);
    } catch (error) {
        console.error("Error handling DELETE request:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}