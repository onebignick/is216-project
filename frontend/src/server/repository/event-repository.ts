import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { event, user, registration } from "../db/schema";
import { MeetgridEvent } from "../entity/event";
import { IBaseRepository } from "./base-repository";
import { User } from "../entity/user";
import { Registration } from "../entity/registration";

export class EventRepository implements IBaseRepository<MeetgridEvent> {
    async getById(id: string): Promise<MeetgridEvent[]> {
        const result = await db.select().from(event).where(eq(event.id, id)) as MeetgridEvent[];
        return result;
    }

    async getAll(): Promise<MeetgridEvent[]> {
        const result = await db.query.event.findMany();
        return result;
    }

    async getAllEventsRelatedToUser(clerkUserId: string): Promise<User[]> {
        const result = await db.select()
            .from(registration)
            .leftJoin(event, eq(registration.eventId, event.id))
            .leftJoin(user, eq(registration.userId, user.clerkUserId))
            .where(eq(registration.userId, clerkUserId))

        if (result.length == 0 ) {
            console.log("No events found for user:", clerkUserId);
            return [];
        }

        const resultUser: User = result[0].user as User;
        resultUser.organizedEvents = [];
        resultUser.adminEvents = [];
        resultUser.registeredEvents = [];
        for (let i=0;i<result.length;i++) {
            if (result[i].user_event.role === "organizer") {
                resultUser.organizedEvents.push(result[i].event! as MeetgridEvent);
            } else if (result[i].user_event.role === "admin") {
                resultUser.adminEvents.push(result[i].event! as MeetgridEvent);
            } else if (result[i].user_event.role === "attendee") {
                resultUser.registeredEvents.push(result[i].event! as MeetgridEvent);
            }
        }

        return [resultUser];
    }

    async getAllEvents(clerkUserId: string): Promise<MeetgridEvent[]> {
        const result = await db
            .select()
            .from(registration)
            .innerJoin(event, eq(registration.eventId, event.id))
            .where(eq(registration.userId, clerkUserId)); 
    
        if (result.length === 0) {
            console.log("No events found for user:", clerkUserId);
            return [];
        }
    
        // Map over result to extract events
        const organizedEvents: MeetgridEvent[] = result.map(row => row.event as MeetgridEvent);
    
        return organizedEvents;
    }
    
    async getRecentEventActivityRelatedToUser(clerkUserId: string) : Promise<{username: string | null | undefined, role: "admin" | "organizer" | "attendee" | null}[]> {
        const result = await db.select()
            .from(registration)
            .leftJoin(event, eq(registration.eventId, event.id))
            .leftJoin(user, eq(registration.userId, user.clerkUserId))
            .where(eq(registration.userId, clerkUserId))
        
        console.log(result);
        if (result.length == 0 ) {
            return [];
        }

        const resultUserActvity = [];
        let currentActivity;
        for(let i=0;i<result.length;i++) {
            currentActivity = result[i];
            resultUserActvity.push({
                username: currentActivity.user?.username,
                event: currentActivity.event?.name,
                role: currentActivity.user_event.role,
            })
        }

        return resultUserActvity;
    }

    async createOne(item: MeetgridEvent): Promise<{id: string}[]> {
        const newEvent : {id: string}[] = await db.insert(event).values(item).returning();
        const newRelation = {
            eventId: newEvent[0].id,
            userId: item.createdBy,
            role: "organizer",
        } as Registration
        await this.createOneUserEventRelation(newRelation);

        return newEvent
    }

    async createMany(items: MeetgridEvent[]): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(event).values(items).returning();
        return result;
    }

    async updateOne(id: string, item: MeetgridEvent): Promise<{id: string}[]> {
        try {
            console.log(id, item)
            const result = await db.update(event).set(item).where(eq(event.id, id)).returning();
            console.log(result);
            return result;
        } catch (e) {
            console.log(e.message);
            throw new Error(e.message);
        }
    }
    
    // Method to get an event by its unique code
    async getEventByCode(code: string): Promise<MeetgridEvent | null> {
        const result = await db.query.event.findFirst({
            where: eq(event.eventCode, code) // Assuming 'code' is a field in your event schema
        });
        return result || null;
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

    async createOneUserEventRelation(relation: Registration) {
        const result = await db.insert(registration).values({
            eventId: relation.eventId,
            userId: relation.userId,
            role: relation.role,
        });
        return result;
    }

    async findRegistrationByUserIdAndEventId(userId: string, eventId: string) {
        const result = await db.select().from(registration).where(
            and(
                eq(registration.eventId, eventId),
                eq(registration.userId, userId)
            )
        )
        return result;
    }
}