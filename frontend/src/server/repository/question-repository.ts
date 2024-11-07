import { eq } from "drizzle-orm";
import { db } from "../db";
import { notes_questions } from "../db/schema";
import { MeetgridQuestions } from "../entity/question";

export class QuestionRepository {
  async getById(id: string): Promise<MeetgridQuestions[]> {
    return db.query.notes_questions.findMany({ where: { id } });
  }

  async getAll(): Promise<MeetgridQuestions[]> {
    return db.query.notes_questions.findMany();
  }

  async createOne(item: MeetgridQuestions): Promise<{ id: string }[]> {
    console.log("Inserting item to DB:", item);  // Log before DB insert
    return db.insert(notes_questions).values(item).returning();
}

  async createMany(items: MeetgridQuestions[]): Promise<{ id: string }[]> {
    const sanitizedItems = items.map(item => ({
      ...item,
      createdAt: item.createdAt || new Date(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    }));
    return db.insert(notes_questions).values(sanitizedItems).returning();
  }

  async updateOne(id: string, item: MeetgridQuestions): Promise<{ id: string }[]> {
    return db.update(notes_questions).set(item).where(eq(notes_questions.id, id)).returning();
  }

  async getQuestionsByEventId(eventId: string): Promise<MeetgridQuestions[]> {
    return db.query.notes_questions.findMany({
      where: eq(notes_questions.eventId, eventId),
    });
  }
}