import { NextResponse } from "next/server";
import { AnswerService } from "../service/AnswerService"; // Adjust the import path as necessary
import { auth } from "@clerk/nextjs/server";

export class NotesController {
    answerService: AnswerService ;

    constructor() {
        this.answerService = new AnswerService();
    }

    async handleNoteCreation(request: Request) {
      try {
          const newNote = await request.json();
           // Optionally, validate the structure of newEvent here
          if (typeof newNote.startDate !== 'string' || typeof newNote.endDate !== 'string') {
              throw new Error("Invalid date format");
          }

          // Convert date strings to Date objects if necessary
          if (newNote.reminder && typeof newNote.reminder === 'string') {
              newNote.reminder = new Date(newNote.reminder);
          }

          // Proceed with creating the event
          const result = await this.answerService.createOneNote(newNote);
          return NextResponse.json({ message: "success",  eventCode: newNote.eventCode, result: result}, { status: 200 })
          
      } catch {
          return NextResponse.json({ message: "An Error occured"}, { status: 500 })
      }
    }

    // async handleGetAllRelatedNotesToUserBooking() {
    //     try {
    //         const currentClerkUserId = auth();
    //         const results = await this.notesService.getAllNotesRelatedToBooking(currentClerkUserId.userId!);
    //         return NextResponse.json({message: "success", result: results}, {status: 200});
    //     } catch {
    //         return NextResponse.json({message: "An error occured"}, {status: 500});
    //     }
    // }

}
