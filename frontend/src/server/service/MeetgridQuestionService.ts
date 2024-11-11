import { MeetgridQuestion } from "../entity/MeetgridQuestion";
import { MeetgridQuestionRepository } from "../repository/MeetgridQuestionRepository";

export class MeetgridQuestionService {
    meetgridQuestionRepository: MeetgridQuestionRepository;

    constructor() {
        this.meetgridQuestionRepository = new MeetgridQuestionRepository();
    }

    async findByEvent(eventId: string) {
        const targetQuestions = await this.meetgridQuestionRepository.findByEvent(eventId);
        return targetQuestions;
    }

    async createOne(questionToCreate: MeetgridQuestion) {
        const createdQuestion = await this.meetgridQuestionRepository.createOne(questionToCreate);
        return createdQuestion;
    }

    async updateMany(questions: MeetgridQuestion[]) {
        for (let i=0;i<questions.length;i++) {
            questions[i].order = i;
            await this.meetgridQuestionRepository.updateOne(questions[i])
        }
        return;
    }

    async updateOne(questionToUpdate: MeetgridQuestion) {
        const updatedQuestion = await this.meetgridQuestionRepository.updateOne(questionToUpdate);
        return updatedQuestion;
    }

    async deleteOne(questionIdToDelete: string) {
        const deletedQuestion = await this.meetgridQuestionRepository.deleteOne(questionIdToDelete);
        return deletedQuestion;
    }
}