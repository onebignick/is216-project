import { currentUser } from "@clerk/nextjs/server";
import { EventService } from "@/server/service/EventService";
import EventPage from "../../../components/events/events"; // Adjust the path as necessary
import { BookingService } from "@/server/service/BookingService";

export default async function Event() {
    const user = await currentUser();
    if (!user) return <p>Please log in to view events.</p>;

    const eventService = new EventService();
    const allEvents = await eventService.getAllEvents(user.id);
    const bookingService = new BookingService();
    
    // Fetch attendee bookings (where the user is attending)
    const attendeeBookings = await bookingService.getAllBookEventsJoinByUser(user.id);

    // Fetch organizer bookings (where the user is organizing)
    const organizerBookings = await bookingService.getAllBookEventsOrganizedByUser(user.id);

    // Log the events and bookings for debugging
    console.log("All Events:", allEvents);
    console.log("Attendee Bookings:", attendeeBookings);
    console.log("Organizer Bookings:", organizerBookings);

    // If you need to combine attendee and organizer bookings into a single list:
    const combinedBookings = [...attendeeBookings, ...organizerBookings];

    // Log the events fetched from the database
    console.log("Events from DB:", allEvents); 
    
    return <EventPage events={allEvents}  bookings={combinedBookings}/>;
}
