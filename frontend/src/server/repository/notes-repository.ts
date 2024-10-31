import { eq } from "drizzle-orm";
import { db } from "../db";
import { notes } from "../db/schema"; // Ensure this path is correct
import { MeetgridNote } from "../entity/notes"; // Ensure this path is correct
import { IBaseRepository } from "./base-repository";

export class NotesRepository implements IBaseRepository<MeetgridNote> {

    async getById(id: string): Promise<MeetgridNote[]> {
        const result = await db.query.notes.findMany({
            with: {
                id: id
            },
        });
        return result
    }

    async getAll(): Promise<MeetgridNote[]> {
        const result = await db.query.notes.findMany();
        return result;
    }

    async createOne(item: MeetgridNote): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(notes).values(item).returning();
        return result
    }

    // Create multiple notes
    async createMany(items: MeetgridNote[]): Promise<{ id: string }[]> {
        // Ensure all items have non-nullable fields
        const validItems = items.map(item => {
            if (!item.name || !item.content) {
                throw new Error("Name and content cannot be null for all notes");
            }
            return {
                name: item.name,
                content: item.content,
                bookingId: item.bookingId, // Allow this to be null if it is in the schema
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            };
        });
    
        const result: { id: string }[] = await db.insert(notes).values(validItems).returning();
        return result;
    }
    
    async updateOne(id: string, item: MeetgridNote): Promise<{ id: string }[]> {
        if (!item.name || !item.content) {
            throw new Error("Name and content cannot be null for the note to update.");
        }
    
        const updateValues = {
            name: item.name,
            content: item.content,
            bookingId: item.bookingId || null, // Allow bookingId to be null
            updatedAt: new Date().toISOString(), // Set current date as updatedAt
        };
    
        const result: { id: string }[] = await db.update(notes)
            .set(updateValues)
            .where(eq(notes.id, id))
            .returning();
    
        return result;
    }
    
    // Method to get an event by its unique code
    async getNotesByBookingId(bookingId: string): Promise<MeetgridNote[]> {
        const result = await db.query.notes.findMany({
            where: eq(notes.bookingId, bookingId), // Ensure this is correctly filtering notes by bookingId
        });
    
        // Always return an array
        return result || []; // Use empty array as fallback
    }

    // todo delete logic
    async deleteOne(id: string): Promise<MeetgridNote[]> {
        console.log(id);
        return [];
    }

    async deleteMany(ids: string[]): Promise<MeetgridNote[]> {
        console.log(ids);
        return []
    }

}
