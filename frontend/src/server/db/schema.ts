import { sql } from "drizzle-orm";
import { pgTableCreator, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `is216_${name}`);

export const user = createTable("user", {
	id: uuid("id").defaultRandom().primaryKey(),
	clerkUserId: varchar("clerkUserId", { length: 32 }).unique(),
	username: varchar("username", { length: 100 }),
	firstname: varchar("firstname", { length: 100 }),
	lastname: varchar("lastname", { length: 100 }),
	createdAt: timestamp("createdAt")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updatedAt"),
});

export const event = createTable("event", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", {length: 100}),
	description: varchar("description", {length: 10000}),
	startDate: timestamp("startDate", { mode: "string" }),
	endDate: timestamp("endDate", { mode: "string" }),
	reminder: timestamp("reminder"),

	organizerId: varchar("organizerId", {length: 32}).references(() => user.clerkUserId),
})