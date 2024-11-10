import { MeetgridEventRegistrantController } from "@/server/controller/MeetgridEventRegistrantController";
import { NextRequest } from "next/server";

const meetgridEventRegistrantController: MeetgridEventRegistrantController = new MeetgridEventRegistrantController()

export async function GET(request: NextRequest) {
    return await meetgridEventRegistrantController.find(request);
}

export async function POST(request: NextRequest) {
    return await meetgridEventRegistrantController.save(request);
}

export async function DELETE(request: NextRequest) {
    return await meetgridEventRegistrantController.delete(request);
}