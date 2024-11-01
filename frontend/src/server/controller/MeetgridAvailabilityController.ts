import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { MeetGridAvailabilityService } from "../service/MeetgridAvailabilityService";

export class MeetgridAvailabilityController {
    meetgridAvailabilityService: MeetGridAvailabilityService;

    constructor() {
        this.meetgridAvailabilityService = new MeetGridAvailabilityService();
    }

    async handleUpdateMeetgridAvailability(request: Request) {
        try {
            const updatedMeetgridAvailability = await request.json();
            const updatedItem = await this.meetgridAvailabilityService.updateUserToEventMeetgridAvailability(updatedMeetgridAvailability.eventAvailability);
            console.log(updatedItem)
            return NextResponse.json({ message: "Success"}, { status: 200 });
        } catch {
            return NextResponse.json({ message: "An error occured"}, { status: 500 });
        }
    }

    async handleCreateMeetgridAvailability(request: Request) {
        try {
            const { meetgridAvailability } = await request.json();
            const newItem = await this.meetgridAvailabilityService.createUserToEventMeetgridAvailability(meetgridAvailability);
            return NextResponse.json({message: "Success", result: newItem}, {status: 200});
        } catch {
            return NextResponse.json({ message: "An error occured"}, { status: 500 });
        }
    }

    async handleGetUserToEventMeetgridAvailability(request : NextRequest) {
        const params = request.nextUrl.searchParams;
        const userId = auth().userId;
        const eventId = params.get("eventId");

        const result = await this.meetgridAvailabilityService.getUserToEventMeetgridAvailability(userId!, eventId!);
        return NextResponse.json({ message: "Success", result: result }, { status: 200 });
    }
}