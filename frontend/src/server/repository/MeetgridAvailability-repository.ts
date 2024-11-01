import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { availability } from "../db/schema";
import { MeetgridAvailability } from "../entity/availability";
import { IBaseRepository } from "./base-repository";

export class MeetgridAvailabilityRepository implements IBaseRepository<MeetgridAvailability> {
    async getById(id: string): Promise<MeetgridAvailability[]> {
        const result = await db
        .select()
        .from(availability)
        .where(eq(availability.id, id))

        return result;
    }

    async getAll(): Promise<MeetgridAvailability[]> {
        const result = await db
        .select()
        .from(availability)
        return result;
    }

    async getUserToEventAvailability(userId: string, eventId: string) {
        const result = await db.select()
        .from(availability)
        .where(
            and(
                eq(availability.clerkUserId, userId),
                eq(availability.eventId, eventId),
            )
        )
        return result;
    }

    async createOne(item: MeetgridAvailability): Promise<MeetgridAvailability> {
        const res = await this.getUserToEventAvailability(item.clerkUserId!, item.eventId!);
        console.log(res);
        if (res.length == 0) {
            const newItem: MeetgridAvailability = await db.insert(availability).values(item).returning();
            return newItem;
        } else {
            throw new Error();
        }
    }

    async createMany(items: MeetgridAvailability[]): Promise<{ id: string; }[]> {
        const result: {id: string}[] = await db.insert(availability).values(items).returning();
        return result
    }

    async updateOne(id: string, item: MeetgridAvailability): Promise<{id: string}[]> {
        const result = await db
        .update(availability)
        .set(item)
        .where(eq(availability.id, id))
        .returning();
        return result;
    }

    async deleteOne(id: string): Promise<MeetgridAvailability[]> {
        return id;
    }

    async deleteMany(ids: string[]): Promise<MeetgridAvailability[]> {
        return ids;
    }
}