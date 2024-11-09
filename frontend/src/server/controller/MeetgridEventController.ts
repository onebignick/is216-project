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
        const targetEventCode = request.nextUrl.searchParams.get("code");

        if (targetEventId) {
            const targetEvent = await this.meetgridEventService.findById(targetEventId);
            return NextResponse.json({ message: "success", event: targetEvent}, { status: 200 })
        } else if (targetEventCode) {
            const targetEvent = await this.meetgridEventService.findEventByCode(targetEventCode);
            if (targetEvent.length === 0) return NextResponse.json({ message: "not found" }, {status: 404});
            return NextResponse.json({ message: "success", targetEvent: targetEvent[0] }, {status: 200});
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

    // PUT /api/event
    async update(request: NextRequest) {
        const eventToUpdate = await request.json();
        const updatedEvent = await this.meetgridEventService.updateOneEvent(eventToUpdate);
        return NextResponse.json({ message: "success", events: updatedEvent }, { status: 200 });
    }


    // DELETE /api/event
    async delete(request: NextRequest) {
        const eventToDelete = await request.json();
        const deletedEvent = await this.meetgridEventService.deleteOneEvent(eventToDelete);
        return NextResponse.json({ message: "success", events: deletedEvent }, { status: 200 });
    }
}