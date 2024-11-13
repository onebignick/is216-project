import { eq } from "drizzle-orm";
import { db } from "../db";
import { answer } from "../db/schema";
import { MeetgridAnswer } from "../entity/MeetgridAnswer";
import { BaseRepository } from "./BaseRepository";

export class MeetgridAnswerRepository implements BaseRepository<MeetgridAnswer, string> {
    async findById(id: string) {
        return await db.select().from(answer).where(eq(answer.id, id));
    }

    async findByInterviewId(interviewId: string) {
        return await db.select().from(answer).where(eq(answer.interviewId, interviewId));
    }

    async findAll() {
        return await db.select().from(answer);
    }

    async createOne(meetgridAnswerToCreate: MeetgridAnswer) {
        const createdMeetgridAnswer: MeetgridAnswer[] =  await db.insert(answer).values(meetgridAnswerToCreate).returning();
        return createdMeetgridAnswer;
    }

    async updateOne(meetgridAnswerToUpdate: MeetgridAnswer) {
        const updatedMeetgridAnswer: MeetgridAnswer[] = await db.update(answer).set(meetgridAnswerToUpdate).where(eq(answer.id, meetgridAnswerToUpdate.id!)).returning();
        return updatedMeetgridAnswer;
    }

    async deleteOne(meetgridAnswerIdToDelete: string) {
        const deletedMeetgridAnswer: MeetgridAnswer[] = await db.delete(answer).where(eq(answer.id, meetgridAnswerIdToDelete)).returning();
        return deletedMeetgridAnswer;
    }
}