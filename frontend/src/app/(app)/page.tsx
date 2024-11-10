import { TodaysMeetings } from "@/components/charts/todays-meetings";
import { WeeksMeetings } from "@/components/charts/weeks-meetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import FrontpageCalendar from "@/components/frontpage-calendar";
import { MeetgridEventRegistrantService } from "@/server/service/MeetgridEventRegistrantService";

export default async function Home() {
  // const eventService: EventService = new EventService();
  // const user = await currentUser();
  // const bookingService = new BookingService();

  // if (!user) return <p>Please log in to view events.</p>;
  // const allEvents = await eventService.getAllEvents(user.id);

  // const attendeeBookings = await bookingService.getAllBookEventsJoinByUser(user.id); //attend booking
  // const organizerBookings = await bookingService.getAllBookEventsOrganizedByUser(user.id); //organised bookings
  // const combinedBookings = [...attendeeBookings, ...organizerBookings];

  const meetgridEventRegistrantService: MeetgridEventRegistrantService= new MeetgridEventRegistrantService();
  const user = auth()
  const curUser = await currentUser();

  const meetgridAssociatedEvents = await meetgridEventRegistrantService.findEventWithParticipantsByUserId(user.userId!);

  // const attendeeBookings = await bookingService.getAllBookEventsJoinByUser(user.userId!); //attend booking
  // const organizerBookings = await bookingService.getAllBookEventsOrganizedByUser(user.id); //organised bookings
  // const combinedBookings = [...attendeeBookings, ...organizerBookings];

  // // Get today's date
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  // Filter today's events with null check for event.startDate
  const todaysEvents = meetgridAssociatedEvents.filter(event => {
    // Ensure event.startDate is a valid string
    if (event.event.startDate) {
      const eventDate = new Date(event.event.startDate); // Create Date only if startDate is valid
      return eventDate >= startOfDay && eventDate <= endOfDay;
    }
    return false; // If startDate is null, do not include this event
  });

  // // Calculate start and end of the week (assuming week starts on Sunday)
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  // Filter this week's events
  const weeksEvents =  meetgridAssociatedEvents.filter(event => {
    if (event.event.startDate) {
      const eventDate = new Date(event.event.startDate);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }
    return false;
  });

  return (
    <main className="grid grid-cols-12 grid-rows-12 gap-4 p-4">
      <WelcomeCard className="col-span-12 md:block md:col-span-4 lg:col-span-6" username={(curUser!.username)!}/>
      <TodaysMeetings chartData={[{meetings: `${todaysEvents.length}`}]} className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <WeeksMeetings chartData={[{meetings: `${weeksEvents.length}`}]} className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <FrontpageCalendar events={ meetgridAssociatedEvents} className="row-span-4 col-span-12 lg:row-span-3 lg:col-span-8" />
      {/* <RecentActivityCard clerkUserId={user!.id} className="row-span-4 col-span-12 lg:row-span-3 lg:col-span-4"/> */}
    </main>
  );

}

function WelcomeCard({ username, className } : { username: string, className: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Welcome back {username}!</CardTitle>
        <CardDescription>What would you like to do today?</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="bg-indigo-500 hover:bg-indigo-300">
          <Link href="/event/create">Create New Event</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// async function RecentActivityCard({ className, clerkUserId } : {className: string, clerkUserId: string}) { 
  // const eventService = new EventService();
//   const recentActivity = await eventService.getUserRecentEventActivity(clerkUserId);
  
//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle>
//           Recent Activity
//         </CardTitle>
//         <CardDescription>
//           Information about your recent activity
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-4">
//         {recentActivity.map((activity, index) => {
//           return (
//             <RecentActivityComponent activity={activity} key={index}/>
//           );
//         })}
//       </CardContent>
//     </Card>
//   )
// }

// interface RecentActivity {
//   username: string | null | undefined;
//   role: "organizer" | "admin" | "attendee";
//   event: string | null | undefined
// }

// function RecentActivityComponent({ activity }: { activity: RecentActivity }) {
//   let result;
//   if (activity.role === "attendee") {
//     result = "has registered for " + activity.event;
//   } else if (activity.role === "admin") {
//     result = "was given admin permission for " + activity.event;
//   } else {
//     result = "created " + activity.event;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>
//           {activity?.username}
//         </CardTitle>
//         <CardDescription>
//           <span>{result}</span> {/* Changed <p> to <span> */}
//         </CardDescription>
//       </CardHeader>
//     </Card>
//   )
// }