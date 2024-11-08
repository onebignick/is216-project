import { db } from "@/server/db"
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { eventParticipant } from "../db/schema";
import { and, eq } from "drizzle-orm";

export class MeetgridEventParticipantRepository {

    async findAll() {
        const allEventParticipants = await db.select().from(eventParticipant);
        return allEventParticipants;
    }
    
    async findById(id: string) {
        const targetEventParticipant = await db.select().from(eventParticipant).where(eq(eventParticipant.id, id));
        return targetEventParticipant;
    }

    async findByEventId(eventId: string) {
        const targetEventParticipants = await db.select().from(eventParticipant).where(
            eq(eventParticipant.eventId, eventId!)
        );
        return targetEventParticipants;
    }

    async findByUserId(userId: string) {
        const targetEventParticipants = await db.select().from(eventParticipant).where(
            eq(eventParticipant.userId, userId!)
        );
        return targetEventParticipants;
    }

    async findByEventIdAndUserId(eventId: string, userId: string) {
        const targetEventParticipants = await db.select().from(eventParticipant).where(
            and(
                eq(eventParticipant.userId, userId!),
                eq(eventParticipant.eventId, eventId!)
            )
        );
        return targetEventParticipants;
    }

    async createOne(eventParticipantToCreate: MeetgridEventParticipant) {
        const createdEventParticipant = await db.insert(eventParticipant).values(eventParticipantToCreate).returning();
        return createdEventParticipant;
    }

    async updateOne(eventParticipantToUpdate: MeetgridEventParticipant) {
        const updatedEventParticipant = await db.update(eventParticipant).set(eventParticipantToUpdate).where(eq(eventParticipant.id, eventParticipantToUpdate.id!)).returning();
        return updatedEventParticipant;
    }

    async deleteOne(eventParticipantToDelete: MeetgridEventParticipant) {
        const deletedEventParticipant = await db.delete(eventParticipant).where(eq(eventParticipant.id, eventParticipantToDelete.id!))
        return deletedEventParticipant
    }

}