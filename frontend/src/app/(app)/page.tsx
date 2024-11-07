import { TodaysMeetings } from "@/components/charts/todays-meetings";
import { WeeksMeetings } from "@/components/charts/weeks-meetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventService } from "@/server/service/EventService";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { BookingService } from "@/server/service/BookingService";
import FrontpageCalendar from "@/components/frontpage-calendar";

export default async function Home() {
  const eventService: EventService = new EventService();
  const user = await currentUser();
  const eventsOrganizedByUser = await eventService.getAllEventsRelatedToUser(user!.id);
  const bookingService = new BookingService();
  const bookings = await bookingService.getAllBookEventsOrganizedByUser(user!.id);
  if (!user) return <p>Please log in to view events.</p>;
  const allEvents = await eventService.getAllEvents(user.id);
  // const allCalendarEntries = [...allEvents, ...bookings];

  // Get today's date
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  // Filter today's events with null check for event.startDate
  const todaysEvents = allEvents.filter(event => {
    // Ensure event.startDate is a valid string
    if (event.startDate) {
      const eventDate = new Date(event.startDate); // Create Date only if startDate is valid
      return eventDate >= startOfDay && eventDate <= endOfDay;
    }
    return false; // If startDate is null, do not include this event
  });

  // Calculate start and end of the week (assuming week starts on Sunday)
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  // Filter this week's events
  const weeksEvents = allEvents.filter(event => {
    if (event.startDate) {
      const eventDate = new Date(event.startDate);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }
    return false;
  });

  return (
    <main className="grid grid-cols-12 grid-rows-4 gap-4 p-4">
      <WelcomeCard className="hidden md:block md:col-span-4 lg:col-span-6" username={(user!.username)!}/>
      <TodaysMeetings chartData={[{meetings: `${todaysEvents.length}`}]} className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <WeeksMeetings chartData={[{meetings: `${weeksEvents.length}`}]} className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <FrontpageCalendar events={allEvents} bookings={bookings} className="row-span-2 col-span-12 lg:row-span-3 lg:col-span-8" />
      <RecentActivityCard clerkUserId={user!.id} className="row-span-2 col-span-12 lg:row-span-3 lg:col-span-4"/>
    </main>
  );

}

function ExampleCard({ className } : {className:string}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>This is a test</CardTitle>
        <CardDescription>This is a test</CardDescription>
      </CardHeader>
      <CardContent>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor, exercitationem harum? Eos ullam a sed culpa cumque! Tempora voluptatibus laudantium impedit, excepturi iure ullam explicabo et nesciunt. Repudiandae, ratione deleniti?
      </CardContent>
    </Card>
  )
}

function WelcomeCard({ username, className } : { username: string, className: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Welcome back {username}!</CardTitle>
        <CardDescription>What would you like to do today?</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/event/create">Create a new event</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

async function RecentActivityCard({ className, clerkUserId } : {className: string, clerkUserId: string}) { 
  const eventService = new EventService();
  const recentActivity = await eventService.getUserRecentEventActivity(clerkUserId);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          Recent Activity
        </CardTitle>
        <CardDescription>
          Information about your recent activity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {recentActivity.map((activity, index) => {
          return (
            <RecentActivityComponent activity={activity} key={index}/>
          );
        })}
      </CardContent>
    </Card>
  )
}

interface RecentActivity {
  username: string | null | undefined;
  role: "organizer" | "admin" | "attendee";
  event: string | null | undefined
}

function RecentActivityComponent({ activity }: { activity: RecentActivity }) {
  let result;
  if (activity.role === "attendee") {
    result = "has registered for " + activity.event;
  } else if (activity.role === "admin") {
    result = "was given admin permission for " + activity.event;
  } else {
    result = "created " + activity.event;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {activity?.username}
        </CardTitle>
        <CardDescription>
          <span>{result}</span> {/* Changed <p> to <span> */}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}