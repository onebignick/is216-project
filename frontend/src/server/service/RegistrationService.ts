import { NextResponse } from "next/server";
import { EventService } from "./EventService";

export class RegistrationService {
    eventService: EventService;

    constructor() {
        this.eventService = new EventService()
    }

    async handleEvent(request: Request) {
        try {
            const req = await request.json();
            const targetEvent = await this.eventService.getOneEventByCode(req.eventCode);
            if (targetEvent == null) {
                throw new Error("No event found");
            }

            return NextResponse.json({message: "Success", result: targetEvent}, {status: 200});
        } catch {
            return NextResponse.json({message: "An Error Occured"}, {status: 500});
        }
    }
}