import { sql } from "drizzle-orm";
import { pgTableCreator, timestamp, varchar, uuid, pgEnum } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `is216_${name}`);

export const rolesEnum = pgEnum("roles", ["organizer", "admin", "attendee"]);

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

export const userEvent = createTable("user_event", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: varchar("userId", {length: 32}).references(() => user.clerkUserId, {
		onDelete: "cascade",
	}),
	eventId: uuid("eventId").references(() => event.id, {
		onDelete: "cascade",
	}).notNull(),
	role: rolesEnum("role").default("attendee"),
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
	eventAvailability: varchar("eventAvailability", { length: 2000 }),
	createdBy: varchar("createdBy", {length: 32}).references(() => user.clerkUserId),
});

export const availability = createTable("availability", {
	id: uuid("id").defaultRandom().primaryKey(),
	availabilityString: varchar("availabilityString", {length: 2000}),
	clerkUserId: varchar("clerkUserId", {length: 32}).references(() => user.clerkUserId, {
		onDelete: "cascade",
	}),
	eventId: uuid("eventId").references(() => event.id, {
		onDelete: "cascade",
	}).notNull(),
})

export const booking = createTable("booking", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", {length: 100}),
	date: varchar("date", { length: 1000 }),
	time: timestamp("time"),
	notes: varchar("description", {length: 10000}),
	status: varchar("status", {length: 10000}),
	participantId: varchar("participantId", {length: 32}).references(() => user.clerkUserId, {
		onDelete: "cascade"
	}),
	eventCode: varchar("eventCode", {length: 1000000}).references(() => event.eventCode, {
		onDelete: "cascade"
	}), 
})