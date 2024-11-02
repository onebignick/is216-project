import { currentUser } from "@clerk/nextjs/server";
import ViewNotePage from "@/components/notes/view-notes";
import { BookingService } from "@/server/service/BookingService";
import { redirect } from "next/navigation"; // Use redirect for server-side navigation

export default async function ViewNotes({ searchParams }: { searchParams: { eventCode?: string } }) {
  const user = await currentUser();
  if (!user) return <p>Please log in to view notes.</p>;

  const eventCode = searchParams.eventCode;

  if (!eventCode) {
      redirect("/error");
  }

  const bookingService = new BookingService();
  const bookingEvents = await bookingService.getOneBookEventById(eventCode);

     // Pass the bookingEvents to ViewNotePage
    return (
      <ViewNotePage 
          bookingEvents={bookingEvents ? [bookingEvents] : []} // Pass an empty array if null
      />
  );
}