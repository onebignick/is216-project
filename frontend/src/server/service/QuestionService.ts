import { MeetgridQuestions } from "../entity/question"; // Ensure the correct import for your note entity
import { QuestionRepository } from "../repository/question-repository"; // Adjust the import path as necessary

export class QuestionService {
    questionRepository: QuestionRepository;

    constructor() {
        this.questionRepository = new QuestionRepository();
    }
     // Creates a new event and ensures the code is unique
     async createOneNote(newQuestionsEvent: MeetgridQuestions) {
        try {

            // Attempt to create the event in the repository
            const result = await this.questionRepository.createOne(newQuestionsEvent);

            if (result.length === 0) {
                console.log("Failed to create note");
                return "";
            } else {
                console.log("Create note successfully:", result[0].id);
                return { id: result[0].id};
            }
        } catch (e) {
            console.log("Error creating note:", e.message);
            return "";
        }
    }

    // Fetch all notes related to a specific booking ID
    async getAllQuestionsRelatedToNotes(bookId: string): Promise<MeetgridQuestions[]> {
        try {
            const notes = await this.questionRepository.getQuestionsByNoteId(bookId);
            return notes; // This should now be an array of MeetgridNote
        } catch (e) {
            console.log("Error fetching notes:", e.message);
            return []; // Return an empty array in case of error
        }
    }
}
