import { eq } from "drizzle-orm";
import { db } from "../db";
import { notes_questions } from "../db/schema";
import { MeetgridQuestions } from "../entity/question";

export class QuestionRepository {
    async getById(id: string): Promise<MeetgridQuestions[]> {
        return db.query.notes_questions.findMany({ where: { id } });
    }

    async getAll(): Promise<MeetgridQuestions[]> {
        return db.query.notes_questions.findMany();
    }

    async createOne(item: MeetgridQuestions): Promise<{ id: string }[]> {
        console.log("Inserting item to DB:", item);  // Log before DB insert
        return db.insert(notes_questions).values(item).returning();
    }

    async createMany(items: any[]) {
        try {
            console.log("Inserting items to DB:", items);
            return await db.insert(notes_questions).values(items).returning();
        } catch (error) {
            console.error("Error in createMany:", error.message || error);  // More detailed error logging
            throw new Error("Error inserting questions to DB: " + (error.message || error));
        }
    }
    
    async updateOne(id: string, item: MeetgridQuestions): Promise<{ id: string }[]> {
        return db.update(notes_questions).set(item).where(eq(notes_questions.id, id)).returning();
    }

    async getQuestionsByEventId(eventId: string): Promise<MeetgridQuestions[]> {
        return db.query.notes_questions.findMany({
        where: eq(notes_questions.eventId, eventId),
        });
    }

}