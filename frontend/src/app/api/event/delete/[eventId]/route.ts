import { EventController } from "@/server/controller/EventController";
import { NextResponse } from "next/server";

const eventController: EventController = new EventController()

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const eventId = url.pathname.split("/").pop(); // Get the eventId from the URL

        if (!eventId) {
            return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
        }

        // Pass the event ID to the controller's delete method
        return await eventController.handleDeleteEvent(eventId, request);
    } catch (error) {
        console.error("Error handling DELETE request:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}