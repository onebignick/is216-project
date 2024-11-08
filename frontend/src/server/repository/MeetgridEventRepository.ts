import { db } from "@/server/db"
import { MeetgridEvent } from "../entity/event";
import { event } from "../db/schema";
import { eq } from "drizzle-orm";

export class MeetgridEventRepository {

    async findAll() {
        const allEvents = await db.select().from(event);
        return allEvents;
    }
    
    async findById(id: string) {
        const targetEvent = await db.select().from(event).where(eq(event.id, id));
        return targetEvent;
    }

    async createOne(eventToCreate: MeetgridEvent) {
        const createdEvent = await db.insert(event).values(eventToCreate).returning();
        return createdEvent;
    }

    async updateOne(eventToUpdate: MeetgridEvent) {
        const updatedEvent = await db.update(event).set(eventToUpdate).returning();
        return updatedEvent;
    }

    async deleteOne(eventToDelete: MeetgridEvent) {
        const deletedEvent = await db.delete(event).where(eq(event.id, eventToDelete.id))
        return deletedEvent
    }

}