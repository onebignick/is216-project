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
	updatedAt: timestamp("updatedAt", { mode: "string" }),
});

export const event = createTable("event", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", {length: 100}),
	EventCode: varchar("EventCode", {length: 1000000}),
	description: varchar("description", {length: 10000}),
	startDate: varchar("startDate", { length: 1000 }),
	endDate: varchar("endDate", { length: 1000 }),
	reminder: timestamp("reminder"),
	participantNum: varchar("participantNum", {length: 100}),
	organizerId: varchar("organizerId", {length: 32}).references(() => user.clerkUserId),
})