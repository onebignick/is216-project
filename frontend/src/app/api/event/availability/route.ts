import { MeetgridAvailabilityController } from "@/server/controller/MeetgridAvailabilityController";
import { NextRequest } from "next/server";

const meetgridAvailabilityController: MeetgridAvailabilityController = new MeetgridAvailabilityController();
export async function GET(request: NextRequest) {
    return await meetgridAvailabilityController.handleGetUserToEventMeetgridAvailability(request);
}