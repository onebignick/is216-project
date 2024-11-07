import { NextResponse } from "next/server";
import { QuestionService } from "../service/QuestionService";

export class QuestionsController {
    private questionService = new QuestionService();

    async handleQuestionCreation(request: Request) {
        try {
            const body = await request.json();
            console.log("Received request body:", body);  // Log received body to ensure it's correct
    
            const { eventId, questions } = body;
            if (!eventId || typeof eventId !== "string") {
                console.error("Invalid eventId format:", eventId);
                throw new Error("Invalid eventId format");
            }
            if (!Array.isArray(questions)) {
                console.error("Questions must be an array:", questions);
                throw new Error("Questions must be an array");
            }
    
            // Log each question for further debugging
            questions.forEach((question, index) => {
                console.log(`Question ${index + 1}:`, question);
            });
    
            const result = await this.questionService.createManyQuestions(questions, eventId);
            return NextResponse.json({ message: "Questions saved successfully", result }, { status: 200 });
        } catch (error) {
            console.error("Error in handleQuestionCreation:", error);  // Log the full error object
            return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
        }
    }
  
    async handleGetAllRelatedQuestionsToNotes(eventId: string) {
      const results = await this.questionService.getAllQuestionsRelatedToNotes(eventId);
      return NextResponse.json({ message: "success", results }, { status: 200 });
    }
}