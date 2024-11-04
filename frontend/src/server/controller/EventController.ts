import { NextResponse } from "next/server";
import { EventService } from "../service/EventService";
import { auth } from "@clerk/nextjs/server";

export class EventController {
    eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }

    async handleEventCreation(request: Request) {
        try {
            const newEvent = await request.json();
             // Optionally, validate the structure of newEvent here
            if (typeof newEvent.startDate !== 'string' || typeof newEvent.endDate !== 'string') {
                throw new Error("Invalid date format");
            }

            // Convert date strings to Date objects if necessary
            if (newEvent.reminder && typeof newEvent.reminder === 'string') {
                newEvent.reminder = new Date(newEvent.reminder);
            }

            // Proceed with creating the event
            const result = await this.eventService.createOneEvent(newEvent);
            return NextResponse.json({ message: "success",  eventCode: newEvent.eventCode, result: result}, { status: 200 })
            
        } catch {
            return NextResponse.json({ message: "An Error occured"}, { status: 500 })
        }
    }

    async handleGetAllRelatedEventsToUser() {
        try {
            const currentClerkUserId = auth();
            const results = await this.eventService.getAllEventsRelatedToUser(currentClerkUserId.userId!);
            return NextResponse.json({message: "success", result: results}, {status: 200});
        } catch {
            return NextResponse.json({message: "An error occured"}, {status: 500});
        }
    }

    async handleUpdateEvent(request: Request) {
        try {
            const req = await request.json();
            const result =  await this.eventService.updateOneEvent(req.updatedEvent);
            return NextResponse.json({message: "success", result: result}, {status: 200});
        } catch {
            return NextResponse.json({message: "An error occured"}, {status: 500});
        }
    }

    // New method to handle event deletion
    async handleDeleteEvent(eventId: string, request: Request) {
        try {
            // Check if eventId is valid (you can add additional validation if necessary)
            if (!eventId) {
                return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
            }
    
            const result = await this.eventService.deleteById(eventId); // Call to service to delete the event
    
            if (result) {
                return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Event not found" }, { status: 404 });
            }
    
        } catch (error) {
            console.error("Error deleting event:", error);
            return NextResponse.json({ message: "An error occurred while deleting the event" }, { status: 500 });
        }
    }
}