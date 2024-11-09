import { sql } from "drizzle-orm";
import { pgTableCreator, timestamp, varchar, uuid, unique, integer } from "drizzle-orm/pg-core";
import { string } from "zod";

export const createTable = pgTableCreator((name) => `is216_${name}`);

export const user = createTable("user", {
	id: uuid("id").defaultRandom().primaryKey(),
	clerkUserId: varchar("clerkUserId", { length: 32 }).unique(),
	username: varchar("username", { length: 100 }),
	firstname: varchar("firstname", { length: 100 }),
	lastname: varchar("lastname", { length: 100 }),
	email: varchar("email", { length: 100 }),
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
	role: varchar("role"),
});

export const event = createTable("event", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", {length: 100}).notNull(),
	code: varchar("code", {length: 100}).notNull(),
	description: varchar("description", {length: 10000}).notNull(),
	startDate: varchar("startDate", { length: 1000 }).notNull(),
	endDate: varchar("endDate", { length: 1000 }).notNull(),
	startTimeMinutes: integer("startTimeMinutes").notNull(),
	endTimeMinutes: integer("endTime").notNull(),
	meetingPeriod: integer("meetingPeriod").notNull(),
	backgroundColor: varchar("backgroundColor", { length: 7 }),  // hex color
    borderColor: varchar("borderColor", { length: 7 }),  // hex color
    textColor: varchar("textColor", { length: 7 }),  // hex color
});

export const eventParticipant = createTable("eventParticipant", {
	id: uuid("id").defaultRandom().primaryKey(),
	role: varchar("role", {length: 20}).notNull(),
	userId: varchar("userId", { length: 32 }).references(() => user.clerkUserId, {
		onDelete: "cascade",
	}).notNull(),
	eventId: uuid("eventId").references(() => event.id, {
		onDelete: "cascade"
	}).notNull(),
	availabilityString: varchar("availabilityString", {length: 10000}),
});

export const eventRegistrant = createTable("eventRegistrant", {
	id: uuid("id").defaultRandom().primaryKey(),
	interviewerEmail: varchar("interviewerEmail", { length: 100 }),
	participantEmail: varchar("participantEmail", { length: 100 }),
	eventId: uuid("eventId").references(() => event.id, { onDelete: "cascade" }),
	timeslotIdx: integer("timeslotIdx"),
	dayIdx: integer("dayIdx"),
	zoomLink: varchar("zoomLink", { length: 10000 }),
})

export const availability = createTable("availability", {
	id: uuid("id").defaultRandom().primaryKey(),
	availabilityString: varchar("availabilityString", {length: 10000}),
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
	backgroundColor: varchar("backgroundColor", { length: 7 }),  // hex color
    borderColor: varchar("borderColor", { length: 7 }),  // hex color
    textColor: varchar("textColor", { length: 7 }),  // hex color
	participantId: varchar("participantId", {length: 32}).references(() => user.clerkUserId, {
		onDelete: "cascade"
	}),
	eventCode: varchar("eventCode", {length: 1000000}).references(() => event.code, {
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