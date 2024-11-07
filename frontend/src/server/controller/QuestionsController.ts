import { NextResponse } from "next/server";
import { QuestionService } from "../service/QuestionService";

export class QuestionsController {
    private questionService = new QuestionService();

    async handleQuestionCreation(request: Request) {
        try {
            const body = await request.json();
            console.log("Received request body:", body);  // Verify received data
    
            const { eventId, questions } = body;
            if (!eventId || typeof eventId !== "string") {
                console.error("Invalid eventId format:", eventId);
                throw new Error("Invalid eventId format");
            }
            if (!Array.isArray(questions)) {
                console.error("Questions must be an array:", questions);
                throw new Error("Questions must be an array");
            }
    
            // Save questions logic
            const result = await this.questionService.createManyQuestions(questions, eventId);
            return NextResponse.json({ message: "Questions saved successfully", result }, { status: 200 });
        } catch (error) {
            console.error("Error in handleQuestionCreation:", error.message);
            return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
        }
    }
  
    async handleGetAllRelatedQuestionsToNotes(eventId: string) {
      const results = await this.questionService.getAllQuestionsRelatedToNotes(eventId);
      return NextResponse.json({ message: "success", results }, { status: 200 });
    }
}