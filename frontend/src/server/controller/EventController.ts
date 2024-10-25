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
            console.log(results)
            return NextResponse.json({message: "success", result: results}, {status: 200});
        } catch {
            return NextResponse.json({message: "An error occured"}, {status: 500});
        }
    }
}