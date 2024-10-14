import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { IUser } from "../entity/user";

export class UserRepository {
    async getUserById(id: string) : Promise<IUser[]> {
        const result = await db.select().from(user).where(eq(user.id, id));
        return result;
    }

    async getAllUsers() : Promise<IUser[]> {
        const result = await db.select().from(user);
        return result;
    }

    async createOneUser(id: string) {
        const result = await db.insert(user).values({clerkUserId: id})
        return result;
    }
}