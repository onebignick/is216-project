// pages/api/notes/create.route.ts
import { NotesController } from "@/server/controller/NotesController";

const notesController: NotesController = new NotesController();

export async function POST(request: Request) {
  return await notesController.handleNotesCreation(request);
}
