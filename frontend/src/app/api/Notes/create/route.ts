// // pages/api/notes/create.route.ts
// import { NotesController } from "@/server/controller/AnswerController";


// const notesController: NotesController = new NotesController();

// export async function POST(request: Request) {
  //   return await notesController.handleNoteCreation(request);
  // }
import { NextRequest, NextResponse } from "next/server";
  
export async function GET(request: NextRequest) {
  console.log(request);
  return NextResponse.json({message: "pong"}, {status:200})
}
