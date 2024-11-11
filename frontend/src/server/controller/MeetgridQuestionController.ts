import { NextRequest, NextResponse } from "next/server";
import { MeetgridQuestionService } from "../service/MeetgridQuestionService";

export class MeetgridQuestionController {
    meetgridQuestionService: MeetgridQuestionService;

    constructor() {
        this.meetgridQuestionService = new MeetgridQuestionService();
    }

    async find(request: NextRequest) {
        const targetEventId = request.nextUrl.searchParams.get("eventId");
        if (targetEventId) {
            const targetQuestions = await this.meetgridQuestionService.findByEvent(targetEventId);
            return NextResponse.json({ message: "success", targetQuestions: targetQuestions}, { status: 200 });
        }

        return NextResponse.json({ message: "success"}, { status: 200 });
    }

    async save(request: NextRequest) {
        const questionToCreate = await request.json();
        const createdQuestion = await this.meetgridQuestionService.createOne(questionToCreate);
        return NextResponse.json({ message: "success", createdQuestion: createdQuestion}, { status: 200 });
    }

    async update(request: NextRequest) {
        const { updatedQuestions } = await request.json();
        await this.meetgridQuestionService.updateMany(updatedQuestions);
        return NextResponse.json({ message: "success" }, { status: 200 });
    }

    async delete(request: NextRequest) {
        const { questionIdToDelete } = await request.json();
        const deletedQuestion = await this.meetgridQuestionService.deleteOne(questionIdToDelete);
        return NextResponse.json({ message: "success", deletedQuestion: deletedQuestion }, { status: 200 });
    }
}