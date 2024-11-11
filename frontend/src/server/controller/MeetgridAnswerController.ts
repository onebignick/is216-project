import { NextRequest, NextResponse } from "next/server";
import { MeetgridAnswerService } from "../service/MeetgridAnswerService";
import { MeetgridAnswer } from "../entity/MeetgridAnswer";

export class MeetgridAnswerController {
    meetgridAnswerService: MeetgridAnswerService;

    constructor() {
        this.meetgridAnswerService = new MeetgridAnswerService();
    }

    async find(request: NextRequest) {
        const interviewId = request.nextUrl.searchParams.get("interviewId");

        if (interviewId) {
            const meetgridAnswers: MeetgridAnswer[] = await this.meetgridAnswerService.findByInterviewId(interviewId);
            return NextResponse.json({ message: "success", meetgridAnswers: meetgridAnswers }, {status: 200});
        }
        return NextResponse.json({ message: "success" }, {status: 200});
    }

    async save(request: NextRequest) {
        const meetgridAnswerToCreate = await request.json()
        const createdMeetgridAnswer = await this.meetgridAnswerService.createOne(meetgridAnswerToCreate);
        return createdMeetgridAnswer
    }

    async update(request: NextRequest) {
        const meetgridAnswerToUpdate= await request.json()
        const updatedMeetgridAnswer = await this.meetgridAnswerService.updateOne(meetgridAnswerToUpdate);
        return updatedMeetgridAnswer
    }

    async delete(request: NextRequest) {
        const { meetgridAnswerIdToDelete }= await request.json()
        const deletedMeetgridAnswer = await this.meetgridAnswerService.deleteOne(meetgridAnswerIdToDelete);
        return deletedMeetgridAnswer
    }
}