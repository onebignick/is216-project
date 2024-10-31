import { MeetgridNote } from "../entity/notes"; // Ensure the correct import for your note entity
import { NotesRepository } from "../repository/notes-repository"; // Adjust the import path as necessary

export class NotesService {
    notesRepository: NotesRepository;

    constructor() {
        this.notesRepository = new NotesRepository();
    }
     // Creates a new event and ensures the code is unique
     async createOneNote(newNotesEvent: MeetgridNote) {
        try {

            // Attempt to create the event in the repository
            const result = await this.notesRepository.createOne(newNotesEvent);

            if (result.length === 0) {
                console.log("Failed to create note");
                return "";
            } else {
                console.log("Create note successfully:", result[0].id);
                return { id: result[0].id};
            }
        } catch (e) {
            console.log("Error creating note:", e.message);
            return "";
        }
    }

    // Fetch all notes related to a specific booking ID
    async getAllNotesRelatedToBooking(bookId: string): Promise<MeetgridNote[]> {
        try {
            const notes = await this.notesRepository.getNotesByBookingId(bookId);
            return notes; // This should now be an array of MeetgridNote
        } catch (e) {
            console.log("Error fetching notes:", e.message);
            return []; // Return an empty array in case of error
        }
    }
}
