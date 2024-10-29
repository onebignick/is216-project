import { currentUser } from "@clerk/nextjs/server";
import { EventService } from "@/server/service/EventService";
import EventPage from "../../../components/events/events"; // Adjust the path as necessary

export default async function Event() {
    const user = await currentUser();
    if (!user) return <p>Please log in to view events.</p>;

    const eventService = new EventService();
    const allEvents = await eventService.getAllEvents(user.id);
    // Log the events fetched from the database
    console.log("Events from DB:", allEvents); 
    return <EventPage events={allEvents} />;
}
