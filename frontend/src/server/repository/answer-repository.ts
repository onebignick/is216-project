import { eq } from "drizzle-orm";
import { db } from "../db";
import { notes_answer, notes_questions } from "../db/schema"; // Ensure this path is correct
import { MeetgridAnswer } from "../entity/answer"; // Ensure this path is correct
import { IBaseRepository } from "./base-repository";

export class AnswerRepository implements IBaseRepository<MeetgridAnswer> {

    async getById(id: string): Promise<MeetgridAnswer[]> {
        const result = await db.query.notes_answer.findMany({
            with: {
                id: id
            },
        });
        return result
    }

    async getAll(): Promise<MeetgridAnswer[]> {
        const result = await db.query.notes_answer.findMany();
        return result;
    }

    async createOne(item: MeetgridAnswer): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(notes_answer).values(item).returning();
        return result
    }

    // Create multiple notes
    async createMany(items: MeetgridAnswer[]): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(notes_answer).values(items).returning();
        return result;
    }

    
    async updateOne(id: string, item: MeetgridAnswer): Promise<{ id: string }[]> {
        if (!item.answer) {
            throw new Error("Answer cannot be null for the note to update.");
        }
    
        const updateValues = {
            answer: item.answer,
            participantId: item.participantId || null, // Allow bookingId to be null
            updatedAt: new Date().toISOString(), // Set current date as updatedAt
        };
    
        const result: { id: string }[] = await db.update(notes_questions)
            .set(updateValues)
            .where(eq(notes_answer.id, id))
            .returning();
    
        return result;
    }
    
    // Method to get an event by its unique code
    async getNotesByBookingId(bookingId: string): Promise<MeetgridAnswer[]> {
        const result = await db.query.notes_answer.findMany({
            where: eq(notes_answer.participantId, bookingId), // Ensure this is correctly filtering notes by bookingId
        });
    
        // Always return an array
        return result || []; // Use empty array as fallback
    }

    // todo delete logic
    async deleteOne(id: string): Promise<MeetgridAnswer[]> {
        console.log(id);
        return [];
    }

    async deleteMany(ids: string[]): Promise<MeetgridAnswer[]> {
        console.log(ids);
        return []
    }

}
