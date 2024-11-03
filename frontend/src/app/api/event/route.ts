import { EventController } from "@/server/controller/EventController";
import { MeetgridAvailabilityController } from "@/server/controller/MeetgridAvailabilityController";
import { NextRequest } from "next/server";

const meetgridAvailabilityController: MeetgridAvailabilityController = new MeetgridAvailabilityController();
const eventController: EventController = new EventController();

export async function GET(request: NextRequest) {
    return await meetgridAvailabilityController.handleGetTotalEventAvailability(request);
}

export async function PUT(request: Request) {
    return await eventController.handleUpdateEvent(request);
}