import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { User } from "../entity/user";

export class UserRepository {
    async getUserById(id: string) {
        const result = await db.select().from(user).where(eq(user.id, id));
        return result;
    }

    async getUserByClerkUserId(id: string) {
        const result = await db.select().from(user).where(eq(user.clerkUserId, id));
        return result;
    }

    async getUserByUsername(username: string) {
        const targetUser = await db.select().from(user).where(eq(user.username, username!));
        return targetUser;
    }

    async getAllUsers() {
        const result = await db.select().from(user);
        return result;
    }

    async findUserByEmail(email: string) {
        const targetUser = await db.select().from(user).where(eq(user.email, email));
        return targetUser;
    }

    async findUserByClerkId(clerkId: string) {
        const targetUser = await db.select().from(user).where(eq(user.clerkUserId, clerkId));
        return targetUser;
    }

    async createOneUser(newUser: User) {
        console.log("UserRepository.createOneUser: creating a user")
        const result = await db.insert(user).values(newUser)
        console.log("UserRepository.createOneUser: created a user")
        return result;
    }
}