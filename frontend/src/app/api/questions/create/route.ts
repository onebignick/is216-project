
import { QuestionsController } from "@/server/controller/QuestionsController";

const questionsController = new QuestionsController();

export async function POST(request: Request) {
    // Handle the creation of new questions (or notes if that's what you're calling them)
    return await questionsController.handleNoteCreation(request);
}

export async function GET(request: Request) {
    // Handle getting all related questions
    return await questionsController.handleGetAllRelatedQuestionsToNotes();
}