// import { QuestionRepository } from "../repository/question-repository";

// export class QuestionService {
//     private questionRepository = new QuestionRepository();

//     async createManyQuestions(questions: any[], eventId: string) {
//         try {
//             // Log the formatted questions to ensure that the prompt is correctly set
//             console.log("Formatted questions for DB:", questions);
    
//             // Assuming 'questions' is a list of objects with a 'prompt' field
//             const formattedQuestions = questions.map((q) => ({
//                 eventId: eventId,
//                 questions: q.prompt, // Ensure this is properly mapped to the database field
//                 createdAt: new Date(),
//                 updatedAt: new Date().toISOString(),
//             }));
    
//             // Proceed with saving the questions
//             return await this.questionRepository.createMany(formattedQuestions);
//         } catch (error) {
//             console.error("Error in createManyQuestions:", error.message || error);  // More detailed error logging
//             throw new Error("Error saving questions: " + (error.message || error));
//         }
//     }
//     async getAllQuestionsRelatedToNotes(eventId: string) {
//         return this.questionRepository.getQuestionsByEventId(eventId) || [];
//     }
// }