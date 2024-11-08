import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { User } from "../entity/user";

export class UserRepository {
    async getUserById(id: string) : Promise<User[]> {
        const result = await db.select().from(user).where(eq(user.id, id));
        return result;
    }

    async getUserByUsername(username: string) {
        const targetUser = await db.select().from(user).where(eq(user.username, username!));
        return targetUser;
    }

    async getAllUsers() : Promise<User[]> {
        const result = await db.select().from(user);
        return result;
    }

    async createOneUser(newUser: User) {
        console.log("UserRepository.createOneUser: creating a user")
        const result = await db.insert(user).values(newUser)
        console.log("UserRepository.createOneUser: created a user")
        return result;
    }
}