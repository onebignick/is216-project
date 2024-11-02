import { MeetgridAvailabilityController } from "@/server/controller/MeetgridAvailabilityController";
import { RegistrationController } from "@/server/controller/RegistrationController";
import { NextRequest } from "next/server";

const registrationController: RegistrationController = new RegistrationController();
const meetgridAvailabilityController: MeetgridAvailabilityController = new MeetgridAvailabilityController();

export async function GET(request: NextRequest) {
    return await meetgridAvailabilityController.handleGetTotalEventAvailability(request);
}

export async function POST(request: Request) {
    return await registrationController.handleEvent(request);
}