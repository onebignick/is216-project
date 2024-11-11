import { MeetgridQuestionController } from "@/server/controller/MeetgridQuestionController";
import { NextRequest } from "next/server";

const meetgridQuestionController: MeetgridQuestionController = new MeetgridQuestionController();

export async function GET(request: NextRequest) {
    return await meetgridQuestionController.find(request);
}

export async function POST(request: NextRequest) {
    return await meetgridQuestionController.save(request);
}

export async function PUT(request: NextRequest) {
    return await meetgridQuestionController.update(request);
}

export async function DELETE(request: NextRequest) {
    return await meetgridQuestionController.delete(request);
}