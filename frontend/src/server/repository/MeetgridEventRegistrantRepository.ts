import { db } from "@/server/db"
import { eventParticipant, eventRegistrant, event, user } from "../db/schema";
import { eq } from "drizzle-orm";
import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";

export class MeetgridEventRegistrantRepository {

    async findAll() {
        const allEventParticipants = await db.select().from(eventRegistrant);
        return allEventParticipants;
    }
    
    async findById(id: string) {
        const targetEventParticipant = await db.select().from(eventRegistrant).where(eq(eventRegistrant.id, id));
        return targetEventParticipant;
    }

    async findByEventId(eventId: string) {
        const targetEventParticipants = await db.select().from(eventRegistrant).where(
            eq(eventRegistrant.eventId, eventId!)
        );
        return targetEventParticipants;
    }

    async createOne(eventRegistrantToCreate: MeetgridEventRegistrant) {
        const createdEventParticipant = await db.insert(eventRegistrant).values(eventRegistrantToCreate).returning();
        return createdEventParticipant;
    }

    async updateOne(eventRegistrantToUpdate: MeetgridEventRegistrant) {
        const updatedEventParticipant = await db.update(eventRegistrant).set(eventRegistrantToUpdate).where(eq(eventRegistrant.id, eventRegistrantToUpdate.id!)).returning();
        return updatedEventParticipant;
    }

    async deleteOne(eventRegistrantToDelete: MeetgridEventRegistrant) {
        const deletedEventParticipant = await db.delete(eventRegistrant).where(eq(eventRegistrant.id, eventRegistrantToDelete.id!))
        return deletedEventParticipant
    }

    // Method to get events with participant and registrant details using userId
    async findEventWithParticipantsByUserId(userId: string) {
        const result = await db
            .select()  // Select all columns from the joined tables
            .from(eventRegistrant)
            .innerJoin(eventParticipant, eq(eventRegistrant.eventId, eventParticipant.eventId)) 
            .innerJoin(event, eq(event.id, eventRegistrant.eventId))// Use `innerJoin` with proper condition
            .where(eq(eventParticipant.userId, userId))  // Filter by the userId passed in
            .execute();
        
        return result;  // Return the result with columns from all joined tables
    }
}