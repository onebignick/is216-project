import { MeetgridQuestions } from "../entity/question";
import { QuestionRepository } from "../repository/question-repository";

export class QuestionService {
  private questionRepository = new QuestionRepository();

  async createOneQuestion(newQuestionsEvent: MeetgridQuestions) {
    console.log("Saving question to DB:", newQuestionsEvent);  // Log the event
    const result = await this.questionRepository.createOne(newQuestionsEvent);
    return result.length ? { id: result[0].id } : null;
}

  async getAllQuestionsRelatedToNotes(eventId: string): Promise<MeetgridQuestions[]> {
    return this.questionRepository.getQuestionsByEventId(eventId) || [];
  }
}