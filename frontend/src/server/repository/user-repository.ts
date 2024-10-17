import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { User } from "../entity/user";

export class UserRepository {
    async getUserById(id: string) : Promise<User[]> {
        const result = await db.select().from(user).where(eq(user.id, id));
        return result;
    }

    async getAllUsers() : Promise<User[]> {
        const result = await db.select().from(user);
        return result;
    }

    async createOneUser(newUser: User) {
        const result = await db.insert(user).values(newUser)
        return result;
    }
}