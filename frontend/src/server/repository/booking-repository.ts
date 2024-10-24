import { eq } from "drizzle-orm";
import { db } from "../db";
import { booking } from "../db/schema";
import { MeetgridBookEvent } from "../entity/booking";
import { IBaseRepository } from "./base-repository";

export class BookEventRepository implements IBaseRepository<MeetgridBookEvent> {
    async getById(id: string): Promise<MeetgridBookEvent[]> {
        const result = await db.query.booking.findMany({
            with: {
                id: id
            },
        });
        return result
    }

    async getAll(): Promise<MeetgridBookEvent[]> {
        const result = await db.query.booking.findMany();
        return result;
    }

    async getAllBookEventsOrganizedByUser(userId: string): Promise<MeetgridBookEvent[]> {
        const result = await db.query.booking.findMany({
            where: eq(booking.participantId, userId)
        });
        return result;
    }

    async createOne(item: MeetgridBookEvent): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(booking).values(item).returning();
        return result
    }

    async createMany(items: MeetgridBookEvent[]): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(booking).values(items).returning();
        return result;
    }

    async updateOne(id: string, item: MeetgridBookEvent): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.update(booking).set(item).where(eq(booking.id, id)).returning();
        return result;
    }
    
    // Method to get an event by its unique code
    async getEventByCode(code: string): Promise<MeetgridBookEvent| null> {
        const result = await db.query.booking.findFirst({
            where: eq(booking.eventCode, code) // Assuming 'code' is a field in your event schema
        });
        return result || null;
    }

    // todo delete logic
    async deleteOne(id: string): Promise<MeetgridBookEvent[]> {
        console.log(id);
        return [];
    }

    async deleteMany(ids: string[]): Promise<MeetgridBookEvent[]> {
        console.log(ids);
        return []
    }
}