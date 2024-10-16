import { NextResponse } from "next/server";
import { EventService } from "../service/EventService";

export class EventController {
    eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }

    async handleEventCreation(request: Request) {
        try {
            const newEvent = await request.json();
            const result = this.eventService.createOneEvent(newEvent);
            return NextResponse.json({ message: "success", result: result}, { status: 200 })
        } catch {
            return NextResponse.json({ message: "An Error occured"}, { status: 500 })
        }
    }

    async handleGetAllEventsOrganizedByUser(request: Request) {
        try {
            const userIdRequest = await request.json();
            const results = this.eventService.getAllEventsOrganizedByUser(userIdRequest);
            return NextResponse.json({message: "success", result: results}, {status: 200});
        } catch {
            return NextResponse.json({message: "An error occured"}, {status: 500});
        }
    }
}