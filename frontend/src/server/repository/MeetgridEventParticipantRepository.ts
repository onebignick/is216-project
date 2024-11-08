import { db } from "@/server/db"
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { eventParticipant } from "../db/schema";
import { eq } from "drizzle-orm";

export class MeetgridEventParticipantRepository {

    async findAll() {
        const allEventParticipants = await db.select().from(eventParticipant);
        return allEventParticipants;
    }
    
    async findById(id: string) {
        const targetEventParticipant = await db.select().from(eventParticipant).where(eq(eventParticipant.id, id));
        return targetEventParticipant;
    }

    async createOne(eventParticipantToCreate: MeetgridEventParticipant) {
        const createdEventParticipant = await db.insert(eventParticipant).values(eventParticipantToCreate).returning();
        return createdEventParticipant;
    }

    async updateOne(eventParticipantToUpdate: MeetgridEventParticipant) {
        const updatedEventParticipant = await db.update(eventParticipant).set(eventParticipantToUpdate).returning();
        return updatedEventParticipant;
    }

    async deleteOne(eventParticipantToDelete: MeetgridEventParticipant) {
        const deletedEventParticipant = await db.delete(eventParticipant).where(eq(eventParticipant.id, eventParticipantToDelete.id!))
        return deletedEventParticipant
    }

}