import { eq } from "drizzle-orm";
import { db } from "../db";
import { notes_questions} from "../db/schema"; // Ensure this path is correct
import { MeetgridQuestions } from "../entity/question"; // Ensure this path is correct
import { IBaseRepository } from "./base-repository";

export class QuestionRepository implements IBaseRepository<MeetgridQuestions> {

    async getById(id: string): Promise<MeetgridQuestions[]> {
        const result = await db.query.notes_questions.findMany({
            with: {
                id: id
            },
        });
        return result
    }

    async getAll(): Promise<MeetgridQuestions[]> {
        const result = await db.query.notes_questions.findMany();
        return result;
    }

    async createOne(item: MeetgridQuestions): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(notes_questions).values(item).returning();
        return result
    }

    // Create multiple notes
    async createMany(items: MeetgridQuestions[]): Promise<{ id: string }[]> {
        // Ensure all items have valid Date for createdAt and updatedAt, converted to string
        const sanitizedItems = items.map(item => ({
            ...item,
            createdAt: item.createdAt ? item.createdAt : new Date(),  // Convert Date to ISO string
            updatedAt: item.updatedAt ? item.updatedAt.toString() : new Date().toISOString()   // Convert Date to ISO string
        }));

        // Insert items into the database
        const result: { id: string }[] = await db.insert(notes_questions).values(sanitizedItems).returning();
        return result;
    }
    
    async updateOne(id: string, item: MeetgridQuestions): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.update(notes_questions).set(item).where(eq(notes_questions.id, id)).returning();
        return result;
    }

    // Method to get an event by its unique code
    async getQuestionsByEventId(eventId: string): Promise<MeetgridQuestions[]> {
        const result = await db.query.notes_questions.findMany({
            where: eq(notes_questions.eventId, eventId), // Ensure this is correctly filtering notes by bookingId
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