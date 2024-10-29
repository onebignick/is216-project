import { currentUser } from "@clerk/nextjs/server";
import { EventService } from "@/server/service/EventService";
import NotesForm from "../../../../../components/forms/create-notes-form"; // Adjust the path as necessary

export default async function CreateNotesForm() {
    const user = await currentUser();
    if (!user) return <p>Please log in to view events.</p>;

    const eventService = new EventService();
    const allEvents = await eventService.getAllEvents(user.id);
    // Log the events fetched from the database
    console.log("Events from DB:", allEvents); 
    return (
    <section className="my-5 grid grid-cols-12">
        <div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8">
            <NotesForm events={allEvents} />
        </div>
    </section>
    );
}
