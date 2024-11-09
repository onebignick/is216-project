import { NextRequest, NextResponse } from "next/server";
import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";
import { MeetgridEventRegistrantService } from "../service/MeetgridEventRegistrantService";

export class MeetgridEventRegistrantController {
    
    meetgridEventRegistrantService: MeetgridEventRegistrantService

    constructor() {
        this.meetgridEventRegistrantService = new MeetgridEventRegistrantService();
    }

    async save(request: NextRequest) {
        const meetgridEventRegistrantToCreate: MeetgridEventRegistrant = await request.json();
        const createdMeetgridEventRegistrant = this.meetgridEventRegistrantService.createOneEventRegistrant(meetgridEventRegistrantToCreate);
        return NextResponse.json({ message: "success", meetgridEventRegistrant: createdMeetgridEventRegistrant }, { status: 200 });
    }
}