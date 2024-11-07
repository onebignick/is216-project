import { sql } from "drizzle-orm";
import { pgTableCreator, timestamp, varchar, uuid, pgEnum, unique, integer } from "drizzle-orm/pg-core";

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

export const registration = createTable("user_event", {
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
	eventCode: varchar("eventCode", {length: 1000000}).unique(),
	description: varchar("description", {length: 10000}),
	startDate: varchar("startDate", { length: 1000 }),
	endDate: varchar("endDate", { length: 1000 }),
	startTime: integer("startTime"),
	endTime: integer("endTime"),
	interval: integer("interval"),
	reminder: varchar("reminder", {length: 1000}),
	participantNum: varchar("participantNum", {length: 100}),
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
}, (t) => ({
	unq: unique().on(t.clerkUserId, t.eventId),
}))

export const booking = createTable("booking", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", {length: 100}),
	date: varchar("date", { length: 1000 }),
	startTime: integer("startTime"),
	endTime: integer("endTime"),
	notes: varchar("description", {length: 10000}),
	status: varchar("status", {length: 10000}),
	participantId: varchar("participantId", {length: 32}).references(() => user.clerkUserId, {
		onDelete: "cascade"
	}),
	eventCode: varchar("eventCode", {length: 1000000}).references(() => event.eventCode, {
		onDelete: "cascade"
	}), 
})

// New question table
export const notes_questions = createTable("notes_questions", {
    id: uuid("id").defaultRandom().primaryKey(),
    questions: varchar("questions", { length: 10000 }).notNull(),
	eventId: uuid("eventId").references(() => event.id, {
		onDelete: "cascade",
	}).notNull(),
    createdAt: timestamp("createdAt")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "string" }),
});

// Modified notes_answer table to link to booking and notes_questions
export const notes_answer = createTable("notes_answer", {
	id: uuid("id").defaultRandom().primaryKey(),
	answer: varchar("answer", { length: 10000 }).notNull(),
	noteId: uuid("noteId").references(() => notes_questions.id, {
		onDelete: "cascade",
	}).notNull(),
	participantId: uuid("participantId").references(() => booking.participantId, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: "string" }),
});