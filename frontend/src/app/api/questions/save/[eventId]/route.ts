import { QuestionsController } from "@/server/controller/QuestionsController";

const questionsController = new QuestionsController();

export async function POST(request: Request) {
    try {
        return await questionsController.handleQuestionCreation(request);
    } catch (error) {
        console.error("Error in POST /api/questions/save:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
}