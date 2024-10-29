import { eq } from "drizzle-orm";
import { db } from "../db";
import { event, user, userEvent } from "../db/schema";
import { MeetgridEvent } from "../entity/event";
import { IBaseRepository } from "./base-repository";
import { UserEvent } from "@/types/UserEvent";
import { User } from "../entity/user";

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
            .from(userEvent)
            .leftJoin(event, eq(userEvent.eventId, event.id))
            .leftJoin(user, eq(userEvent.userId, user.clerkUserId))
            .where(eq(userEvent.userId, clerkUserId))

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
            .from(userEvent)
            .innerJoin(event, eq(userEvent.eventId, event.id))
            .where(eq(userEvent.userId, clerkUserId)); 
    
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
            .from(userEvent)
            .leftJoin(event, eq(userEvent.eventId, event.id))
            .leftJoin(user, eq(userEvent.userId, user.clerkUserId))
            .where(eq(userEvent.userId, clerkUserId))
        
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
            userClerkId: item.createdBy,
            role: "organizer",
        } as UserEvent
        await this.createOneUserEventRelation(newRelation);

        return newEvent
    }

    async createMany(items: MeetgridEvent[]): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(event).values(items).returning();
        return result;
    }

    async updateOne(id: string, item: MeetgridEvent): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.update(event).set(item).where(eq(event.id, id)).returning();
        return result;
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

    async createOneUserEventRelation(relation: UserEvent) {
        const result = await db.insert(userEvent).values({
            eventId: relation.eventId,
            userId: relation.userClerkId,
            role: relation.role,
        });
        return result;
    }
}