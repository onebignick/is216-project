import { NextRequest, NextResponse } from "next/server";
import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";
import { MeetgridEventRegistrantService } from "../service/MeetgridEventRegistrantService";

export class MeetgridEventRegistrantController {
    
    meetgridEventRegistrantService: MeetgridEventRegistrantService

    constructor() {
        this.meetgridEventRegistrantService = new MeetgridEventRegistrantService();
    }

    async find(request: NextRequest) {
        const meetgridEventRegistrantId = request.nextUrl.searchParams.get("meetgridEventRegistrantId");
        const meetgridEventRegistrant = await this.meetgridEventRegistrantService.findById(meetgridEventRegistrantId!);
        return NextResponse.json({ message: "success", meetgridEventRegistrant: meetgridEventRegistrant[0]}, { status: 200 })
    }

    async save(request: NextRequest) {
        const meetgridEventRegistrantToCreate: MeetgridEventRegistrant = await request.json();
        const createdMeetgridEventRegistrant = this.meetgridEventRegistrantService.createOneEventRegistrant(meetgridEventRegistrantToCreate);
        return NextResponse.json({ message: "success", meetgridEventRegistrant: createdMeetgridEventRegistrant }, { status: 200 });
    }

    async delete(request: NextRequest) {
        const { eventRegistrantIdToDelete } = await request.json();
        await this.meetgridEventRegistrantService.deleteOneEventRegistrant(eventRegistrantIdToDelete);
        return NextResponse.json({ message: "success" }, {status: 200});
    }
}