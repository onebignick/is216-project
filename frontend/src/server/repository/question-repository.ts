import { eq } from "drizzle-orm";
import { db } from "../db";
import { questions } from "../db/schema"; // Ensure this path is correct
import { MeetgridQuestions } from "../entity/question"; // Ensure this path is correct
import { IBaseRepository } from "./base-repository";

export class QuestionRepository implements IBaseRepository<MeetgridQuestions> {

    async getById(id: string): Promise<MeetgridQuestions[]> {
        const result = await db.query.questions.findMany({
            with: {
                id: id
            },
        });
        return result
    }

    async getAll(): Promise<MeetgridQuestions[]> {
        const result = await db.query.questions.findMany();
        return result;
    }

    async createOne(item: MeetgridQuestions): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(questions).values(item).returning();
        return result
    }

    // Create multiple notes
    async createMany(items: MeetgridQuestions[]): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(questions).values(items).returning();
        return result;
    }


    async updateOne(id: string, item: MeetgridQuestions): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.update(questions).set(item).where(eq(questions.id, id)).returning();
        return result;
    }
    
    // Method to get an event by its unique code
    async getQuestionsByNoteId(noteId: string): Promise<MeetgridQuestions[]> {
        const result = await db.query.questions.findMany({
            where: eq(questions.noteId, noteId), // Ensure this is correctly filtering notes by bookingId
        });
    
        // Always return an array
        return result || []; // Use empty array as fallback
    }

    // todo delete logic
    async deleteOne(id: string): Promise<MeetgridQuestions[]> {
        console.log(id);
        return [];
    }

    async deleteMany(ids: string[]): Promise<MeetgridQuestions[]> {
        console.log(ids);
        return []
    }

}
