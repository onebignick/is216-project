import { MeetgridAnswer } from "../entity/MeetgridAnswer";
import { MeetgridAnswerRepository } from "../repository/MeetgridAnswerRepository";

export class MeetgridAnswerService {
    meetgridAnswerRepository: MeetgridAnswerRepository;
    
    constructor() {
        this.meetgridAnswerRepository = new MeetgridAnswerRepository();
    }

    async findByInterviewId(interviewId: string) {
        const meetgridAnswers: MeetgridAnswer[] = await this.meetgridAnswerRepository.findByInterviewId(interviewId);
        return meetgridAnswers;
    }

    async createOne(meetgridAnswerToCreate: MeetgridAnswer) {
        const createdMeetgridAnswer: MeetgridAnswer[] = await this.meetgridAnswerRepository.createOne(meetgridAnswerToCreate);
        return createdMeetgridAnswer;
    }

    async updateOne(meetgridAnswerToUpdate: MeetgridAnswer) {
        const updatedMeetgridAnswer: MeetgridAnswer[] = await this.meetgridAnswerRepository.updateOne(meetgridAnswerToUpdate);
        return updatedMeetgridAnswer;
    }

    async deleteOne(meetgridAnswerIdToDelete: string) {
        const deletedMeetgridAnswer: MeetgridAnswer[] = await this.meetgridAnswerRepository.deleteOne(meetgridAnswerIdToDelete);
        return deletedMeetgridAnswer;
    }
}