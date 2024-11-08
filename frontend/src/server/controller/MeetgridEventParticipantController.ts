import { NextRequest, NextResponse } from "next/server";
import { MeetgridEventParticipantService } from "../service/MeetgridEventParticipantService";

export class MeetgridEventParticipantController {

    meetgridEventParticipantService = new MeetgridEventParticipantService;

    constructor() {
        this.meetgridEventParticipantService = new MeetgridEventParticipantService();
    }

    // GET /api/eventParticipant
    async find(request: NextRequest) {
        const targetEventId = request.nextUrl.searchParams.get("eventId");
        const targetUserId = request.nextUrl.searchParams.get("userId");

        if (targetEventId && targetUserId) {
            const eventParticipants = await this.meetgridEventParticipantService.findByEventIdAndUserId(targetEventId, targetUserId);
            return NextResponse.json({ message: "success", eventParticipants: eventParticipants }, { status: 200 })
        } else if (targetEventId) {
            const eventParticipants = await this.meetgridEventParticipantService.findByEventId(targetEventId);
            return NextResponse.json({ message: "success", eventParticipants: eventParticipants});
        } else if (targetUserId) {
            const eventParticipants = await this.meetgridEventParticipantService.findByUserId(targetUserId);
            return NextResponse.json({ message: "success", eventParticipants: eventParticipants});
        }

        const eventParticipants = await this.meetgridEventParticipantService.findAll();
        return NextResponse.json({ message: "success", eventParticipants: eventParticipants }, { status: 200 });
    }

    async save(request: NextRequest) {
        const eventParticipantToCreate = await request.json();
        const createdEventParticipant = await this.meetgridEventParticipantService.createOneEventParticipant(eventParticipantToCreate);
        return NextResponse.json({ message: "success", eventParticipant: createdEventParticipant}, { status: 200 })
    }

    async update(request: NextRequest) {
        const eventParticipantToUpdate = await request.json()
        const updatedEventParticipant = await this.meetgridEventParticipantService.updateOneEventParticipant(eventParticipantToUpdate);
        return NextResponse.json({ message: "success", eventParticipant: updatedEventParticipant}, { status: 200 })
    }

    async delete(request: NextRequest) {
        const eventParticipantToDelete = await request.json()
        const deletedEventParticipant = await this.meetgridEventParticipantService.updateOneEventParticipant(eventParticipantToDelete);
        return NextResponse.json({ message: "success", eventParticipant: deletedEventParticipant}, { status: 200 })
    }
}