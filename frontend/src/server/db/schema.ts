import { sql } from "drizzle-orm";
import { pgTableCreator, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `is216_${name}`);

export const user = createTable("user", {
	id: uuid("id").defaultRandom().primaryKey(),
	clerkUserId: varchar("id", { length: 32 }).unique(),
	username: varchar("username", { length: 100 }),
	firstName: varchar("firstname", { length: 100 }),
	lastName: varchar("lastname", { length: 100 }),
	createdAt: timestamp("createdAt")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updatedAt"),
});
