import { sql } from "drizzle-orm";
import { pgTableCreator, timestamp, varchar, uuid, integer } from "drizzle-orm/pg-core";

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
	dateCreated: varchar("dateCreated", {length: 1000}).default(sql`NOW()`).notNull(),
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
	availabilityString: varchar("availabilityString", {length: 10000}).notNull(),
});

export const eventRegistrant = createTable("eventRegistrant", {
	id: uuid("id").defaultRandom().primaryKey(),
	interviewerEmail: varchar("interviewerEmail", { length: 100 }),
	participantEmail: varchar("participantEmail", { length: 100 }),
	eventId: uuid("eventId").references(() => event.id, { onDelete: "cascade" }),
	timeslotIdx: integer("timeslotIdx"),
	dayIdx: integer("dayIdx"),
	zoomLink: varchar("zoomLink", { length: 10000 }),
	backgroundColor: varchar("backgroundColor", { length: 7 }),  // hex color
    borderColor: varchar("borderColor", { length: 7 }),  // hex color
    textColor: varchar("textColor", { length: 7 }),  // hex color
})

export const eventQuestion = createTable("eventQuestion", {
	id: uuid("id").defaultRandom().primaryKey(),
	eventId: uuid("eventId").references(() => event.id, { onDelete: "cascade" }).notNull(),
	title: varchar("title", { length: 1000 }).notNull(),
	order: integer("order").notNull(),
})

export const answer = createTable("answer", {
	id: uuid("id").defaultRandom().primaryKey(),
	questionId: uuid("questionId").references(() => eventQuestion.id, { onDelete: "cascade"}).notNull(),
	interviewId: uuid("interviewId").references(() => eventRegistrant.id, { onDelete: "cascade" }).notNull(),
	answer: varchar("answer", { length: 10000 }).notNull(),
})