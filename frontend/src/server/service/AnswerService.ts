import { MeetgridAnswer } from "../entity/answer"; // Ensure the correct import for your note entity
import { AnswerRepository } from "../repository/answer-repository"; // Adjust the import path as necessary

export class AnswerService {
    answerRepository: AnswerRepository;

    constructor() {
        this.answerRepository = new AnswerRepository();
    }
     // Creates a new event and ensures the code is unique
     async createOneNote(newNotesEvent: MeetgridAnswer) {
        try {

            // Attempt to create the event in the repository
            const result = await this.answerRepository.createOne(newNotesEvent);

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

    // // Fetch all notes related to a specific set of booking IDs
    // async getAllNotesRelatedToBooking(bookingIds: string[]): Promise<MeetgridAnswer[]> {
    //     try {
    //         // Assume that `getNotesByBookingIds` can handle multiple IDs
    //         const notes = await this.answerRepository.getNotesByBookingId(bookingIds);
    //         return notes; // Return the notes array
    //     } catch (e) {
    //         console.log("Error fetching notes:", e.message);
    //         return []; // Return an empty array in case of error
    //     }
    // }
}
