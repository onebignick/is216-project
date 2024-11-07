// pages/api/notes/create.route.ts
import { NotesController } from "@/server/controller/AnswerController";

const notesController: NotesController = new NotesController();

export async function POST(request: Request) {
  return await notesController.handleNoteCreation(request);
}
