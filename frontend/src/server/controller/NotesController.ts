// server/controller/NotesController.ts
import { db } from "@/server/db"; // Import your DB connection
import { NextResponse } from "next/server";
import { z } from "zod"; // You can use zod for validation
import { booking } from "@/server/db/schema"; // Import the booking table reference

// Define your Zod schema
const noteSchema = z.object({
  date: z.string().nonempty(),
  time: z.string().nonempty(),
  notes: z.string().optional(),
  participantId: z.string().optional(),
});

// Define the TypeScript type based on the Zod schema
type NoteData = z.infer<typeof noteSchema>;

export class NotesController {
  async handleNotesCreation(request: Request) {
    try {
      const body = await request.json(); // Parse the incoming request body
      const validatedData: NoteData = noteSchema.parse(body); // Validate the data and explicitly define its type

      // Save the note to the database using the booking reference
      const result = await db.insert(booking).values(validatedData).returning('*');

      return NextResponse.json(result); // Return the created note
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
  }
}