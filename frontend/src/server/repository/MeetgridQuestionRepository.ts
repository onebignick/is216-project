import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { eventQuestion } from "../db/schema";
import { MeetgridQuestion } from "../entity/MeetgridQuestion";

export class MeetgridQuestionRepository {
    async findById(id: string) {
        const targetQuestion = await db.select().from(eventQuestion).where(eq(eventQuestion.id, id))
        return targetQuestion;
    }

    async findByEvent(eventId: string) {
        const targetQuestions = await db.select().from(eventQuestion).where(eq(eventQuestion.eventId, eventId)).orderBy(asc(eventQuestion.order));
        return targetQuestions;
    }

    async createOne(questionToCreate: MeetgridQuestion) {
        const createdQuestion = await db.insert(eventQuestion).values(questionToCreate).returning();
        return createdQuestion;
    }

    async updateOne(questionToUpdate: MeetgridQuestion) {
        const updatedQuestion = await db.update(eventQuestion).set(questionToUpdate).where(eq(eventQuestion.id, questionToUpdate.id!)).returning();
        return updatedQuestion;
    }

    async deleteOne(questionIdToDelete: string) {
        const deletedQuestion = await db.delete(eventQuestion).where(eq(eventQuestion.id, questionIdToDelete));
        return deletedQuestion;
    }
}