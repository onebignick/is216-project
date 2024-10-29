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
            return NextResponse.json({ message: "Success"}, { status: 200 });
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