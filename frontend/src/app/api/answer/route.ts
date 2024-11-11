
import { MeetgridAnswerController } from "@/server/controller/MeetgridAnswerController";
import { NextRequest } from "next/server";

const meetgridAnswerController: MeetgridAnswerController = new MeetgridAnswerController();

export async function GET(request: NextRequest) {
    return await meetgridAnswerController.find(request);
}

export async function POST(request: NextRequest) {
    return await meetgridAnswerController.save(request);
}

export async function PUT(request: NextRequest) {
    return await meetgridAnswerController.update(request);
}

export async function DELETE(request: NextRequest) {
    return await meetgridAnswerController.delete(request);
}