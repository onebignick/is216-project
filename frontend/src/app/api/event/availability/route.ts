import { MeetgridAvailabilityController } from "@/server/controller/MeetgridAvailabilityController";
import { NextRequest } from "next/server";

const meetgridAvailabilityController: MeetgridAvailabilityController = new MeetgridAvailabilityController();

export async function GET(request: NextRequest) {
    return await meetgridAvailabilityController.handleGetUserToEventMeetgridAvailability(request);
}

export async function POST(request: Request) {
    return await meetgridAvailabilityController.handleCreateMeetgridAvailability(request);
}

export async function PUT(request: Request) {
    return await meetgridAvailabilityController.handleUpdateMeetgridAvailability(request);
}