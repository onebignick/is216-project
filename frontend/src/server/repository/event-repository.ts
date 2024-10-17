import { eq } from "drizzle-orm";
import { db } from "../db";
import { event } from "../db/schema";
import { MeetgridEvent } from "../entity/event";
import { IBaseRepository } from "./base-repository";

export class EventRepository implements IBaseRepository<MeetgridEvent> {
    async getById(id: string): Promise<MeetgridEvent[]> {
        const result = await db.query.event.findMany({
            with: {
                id: id
            },
        });
        return result
    }

    async getAll(): Promise<MeetgridEvent[]> {
        const result = await db.query.event.findMany();
        return result;
    }

    async getAllEventsOrganizedByUser(userId: string): Promise<MeetgridEvent[]> {
        const result = await db.query.event.findMany({
            where: eq(event.organizerId, userId)
        });
        return result;
    }

    async createOne(item: MeetgridEvent): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(event).values(item).returning();
        return result
    }

    async createMany(items: MeetgridEvent[]): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(event).values(items).returning();
        return result;
    }

    async updateOne(id: string, item: MeetgridEvent): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.update(event).set(item).where(eq(event.id, id)).returning();
        return result;
    }

    // todo delete logic
    async deleteOne(id: string): Promise<MeetgridEvent[]> {
        console.log(id);
        return [];
    }

    async deleteMany(ids: string[]): Promise<MeetgridEvent[]> {
        console.log(ids);
        return []
    }
}