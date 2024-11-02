import { currentUser } from "@clerk/nextjs/server";
// import { NotesService } from "@/server/service/NotesService";
import { NotesDisplay } from "@/components/notes/notes";
import { EventService } from "@/server/service/EventService";

export default async function Notes() {
    const user = await currentUser();
    if (!user) return <p>Please log in to view notes.</p>;

    const eventService = new EventService();
    const allEvents = await eventService.getAllEvents(user.id);
    console.log("Events from DB:", allEvents); // Log the events fetched from the DB

    // Assuming allEvents contains the notes you want to display
    return <NotesDisplay notes={allEvents} />;
}