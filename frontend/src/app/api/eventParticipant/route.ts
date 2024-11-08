import { MeetgridEventParticipantController } from "@/server/controller/MeetgridEventParticipantController";
import { NextRequest } from "next/server";

const meetgridEventParticipantController: MeetgridEventParticipantController = new MeetgridEventParticipantController();

export async function GET(request: NextRequest) {
    return await meetgridEventParticipantController.find(request);
}

export async function POST(request: NextRequest) {
    return await meetgridEventParticipantController.save(request);
}

export async function PUT(request: NextRequest) {
    return await meetgridEventParticipantController.update(request);
}

export async function DELETE(request: NextRequest) {
    return await meetgridEventParticipantController.delete(request);
}