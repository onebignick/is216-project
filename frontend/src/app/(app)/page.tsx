import { TodaysMeetings } from "@/components/charts/todays-meetings";
import { WeeksMeetings } from "@/components/charts/weeks-meetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import FrontpageCalendar from "@/components/frontpage-calendar";
import { MeetgridEventRegistrantService } from "@/server/service/MeetgridEventRegistrantService";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

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

  // Get today's date in Singapore Time (SGT)
  const today = toSingaporeTime(new Date());

  // Set start and end of today (using Singapore Time)
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  // Filter today's events with null check for event.startDate
  const todaysEvents = meetgridAssociatedEvents.filter(event => {
    if (event.event.startDate && event.eventRegistrant.dayIdx !== null && event.eventRegistrant.dayIdx !== undefined) {
      let startDate = new Date(event.event.startDate); // Ensure startDate is valid
      startDate = toSingaporeTime(startDate); // Convert to Singapore Ti
      const dayIdx = event.eventRegistrant.dayIdx; // The day index of the event (0 is the same day as startDate)
  
      // Calculate the event date by adding dayIdx to the startDate
      startDate.setDate(startDate.getDate() + dayIdx); // Add dayIdx to startDate to get the event date
  
      // Check if the eventDate is today
      return startDate >= startOfDay && startDate <= endOfDay;
    }
    
    return false; // If startDate or dayIdx is missing, exclude the event
  });

  // Calculate start and end of the week in Singapore Time (SGT)
  const startOfWeek = toSingaporeTime(new Date(today.setDate(today.getDate() - today.getDay()))); // Sunday of this week
  const endOfWeek = toSingaporeTime(new Date(today.setDate(today.getDate() - today.getDay() + 6))); // Saturday of this week

  // Filter this week's events
  const weeksEvents =  meetgridAssociatedEvents.filter(event => {
    if (event.event.startDate) {
      let eventDate = new Date(event.event.startDate);
      eventDate = toSingaporeTime(eventDate); // Convert to Singapore Time
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }
    return false;
  });

  return (
    <main className="grid grid-cols-12 gap-4 p-4">
      <WelcomeCard className="col-span-12 lg:block lg:col-span-6" username={(curUser!.username)!}/>
      <TodaysMeetings chartData={[{meetings: `${todaysEvents.length}`}]} className="hidden lg:block lg:col-span-3"/>
      <WeeksMeetings chartData={[{meetings: `${weeksEvents.length}`}]} className="hidden lg:block  lg:col-span-3"/>
      <FrontpageCalendar events={ meetgridAssociatedEvents} className="col-span-12" />
      {/* <RecentActivityCard clerkUserId={user!.id} className="row-span-4 col-span-12 lg:row-span-3 lg:col-span-4"/> */}
    </main>
  );

}

// Function to convert a UTC date to Singapore Time (SGT)
function toSingaporeTime(date: Date) {
  const singaporeOffset = 8 * 60; // Singapore is UTC+8, so the offset is +8 hours in minutes
  const localOffset = date.getTimezoneOffset(); // Local timezone offset in minutes
  const adjustedTime = new Date(date.getTime() + (singaporeOffset + localOffset) * 60000); // Adjust by the offset
  return adjustedTime;
}

// Get today's date in Singapore Time (SGT)
const today = toSingaporeTime(new Date());

function WelcomeCard({ username, className } : { username: string, className: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-4xl font-semibold">
          <div className="inline-block">
              <TypewriterEffect
                words={[{ text: `Welcome back, ${username}!` }]}
                className="text-lg font-semibold"
                cursorClassName="bg-coral"
              />
            </div>
        </CardTitle>
        <CardDescription>What would you like to do today?</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="bg-coral text-black hover:bg-coral/70 text-md py-4 px-6">
          <Link href="/event/create">Create New Interview</Link>
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