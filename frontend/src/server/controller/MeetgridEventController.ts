import { NextRequest, NextResponse } from "next/server";
import { MeetgridEventService } from "../service/MeetgridEventService";

export class MeetgridEventController {

    meetgridEventService: MeetgridEventService;

    constructor() {
        this.meetgridEventService = new MeetgridEventService();
    }

    // GET /api/event
    async find(request: NextRequest) {
        const targetEventId = request.nextUrl.searchParams.get("eventId");

        if (targetEventId) {
            const targetEvent = await this.meetgridEventService.findById(targetEventId);
            return NextResponse.json({ message: "success", event: targetEvent}, { status: 200 })
        }

        const allEvents = await this.meetgridEventService.findAll();
        return NextResponse.json({ message: "success", events: allEvents}, { status: 200 });
    }

    // POST /api/event
    async save(request: NextRequest) {
        const eventToCreate = await request.json();
        const createdEvent = await this.meetgridEventService.createOneEvent(eventToCreate);
        return NextResponse.json({ message: "success", events: createdEvent }, { status: 200 });
    }

}