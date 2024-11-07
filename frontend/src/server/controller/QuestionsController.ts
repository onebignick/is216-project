import { NextResponse } from "next/server";
import { QuestionService } from "../service/QuestionService"; // Adjust the import path as necessary
import { auth } from "@clerk/nextjs/server";

export class QuestionsController {
    questionsService: QuestionService;

    constructor() {
        this.questionsService = new QuestionService();
    }

    async handleNoteCreation(request: Request) {
        try {
          const { eventId, questions } = await request.json();
      
          // Ensure the data is structured correctly
          if (!Array.isArray(questions)) {
            throw new Error("Expected an array of questions");
          }
      
          if (typeof eventId !== "string") {
            throw new Error("Invalid eventId format");
          }
      
          // Process the questions and associate them with the eventId
          const results = [];
          for (const question of questions) {
            if (typeof question.prompt !== "string") {
              throw new Error("Invalid question prompt format");
            }
      
            const result = await this.questionsService.createOneQuestion({
              ...question,
              eventId,  // Add the eventId to each question
            });
            results.push(result);
          }
      
          return NextResponse.json({ message: "Questions created successfully", results }, { status: 200 });
        } catch (error) {
          console.error(error);
          return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
        }
      }      

    async handleGetAllRelatedQuestionsToNotes() {
        try {
            const currentClerkUserId = auth();
            const results = await this.questionsService.getAllQuestionsRelatedToNotes(currentClerkUserId.userId!);
            return NextResponse.json({message: "success", result: results}, {status: 200});
        } catch {
            return NextResponse.json({message: "An error occured"}, {status: 500});
        }
    }

}
