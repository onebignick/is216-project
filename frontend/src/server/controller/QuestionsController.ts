import { NextResponse } from "next/server";
import { QuestionService } from "../service/QuestionService";

export class QuestionsController {
    private questionsService = new QuestionService();
  
    async handleQuestionCreation(request: Request) {
        try {
            const body = await request.json();
            console.log("Received request body:", body);  // Verify received data
    
            const { eventId, questions } = body;
            if (!eventId || typeof eventId !== "string") {
                throw new Error("Invalid eventId format");
            }
            if (!Array.isArray(questions)) {
                throw new Error("Questions must be an array");
            }
            
            // Process questions as expected
        } catch (error) {
            console.error("Error in handleQuestionCreation:", error.message);
            return NextResponse.json(
              { message: error.message || "An error occurred" },
              { status: 500 }
            );
        }
    }
  
    async handleGetAllRelatedQuestionsToNotes(eventId: string) {
      const results = await this.questionsService.getAllQuestionsRelatedToNotes(eventId);
      return NextResponse.json({ message: "success", results }, { status: 200 });
    }
  }