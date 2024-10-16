import { NextResponse } from "next/server";
import { EventService } from "../service/EventService";

export class EventController {
    eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }

    async handlePost(request: Request) {
        try {
            const newEvent = await request.json();
            console.log(newEvent)
            const result = this.eventService.createOneEvent(newEvent);
            console.log(result)
            return NextResponse.json({ message: "success"}, { status: 200 })
        } catch {
            return NextResponse.json({ message: "An Error occured"}, { status: 500 })
        }
    }
}