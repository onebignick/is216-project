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
	eventCode: varchar("EventCode", {length: 1000000}).unique(),
	description: varchar("description", {length: 10000}),
	startDate: varchar("startDate", { length: 1000 }),
	endDate: varchar("endDate", { length: 1000 }),
	reminder: timestamp("reminder"),
	participantNum: varchar("participantNum", {length: 100}),
	organizerId: varchar("organizerId", {length: 32}).references(() => user.clerkUserId),

});

export const booking = createTable("booking", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", {length: 100}),
	date: varchar("date", { length: 1000 }),
	time: timestamp("time"),
	notes: varchar("description", {length: 10000}),
	status: varchar("status", {length: 10000}),
	participantId: varchar("participantId", {length: 32}).references(() => user.clerkUserId),
	eventCode: varchar("eventCode", {length: 1000000}).references(() => event.eventCode), // Put it as Event ID first maybe will change later as EventCode in event table is not unique
})