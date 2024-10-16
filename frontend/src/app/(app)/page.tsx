import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeEventCard } from "@/components/ui/event-card";
import { MeetgridEvent } from "@/server/entity/event";
import { EventService } from "@/server/service/EventService";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const eventService: EventService = new EventService();
  const user = await currentUser();
  const eventsOrganizedByUser = await eventService.getAllEventsOrganizedByUser(user!.id);

  return (
    <main className="flex">
      <HomePanel username={(user!.username)!} eventsOrganizedByUser={eventsOrganizedByUser}/>
    </main>
  );
}

async function HomePanel({username, eventsOrganizedByUser}: {username: string, eventsOrganizedByUser: MeetgridEvent[]}) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome back, {username}!
          </CardTitle>
          <CardDescription>
            What would you like to do today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>Upcoming Events</CardTitle>
          {eventsOrganizedByUser.map((event, index) => {
            return <HomeEventCard key={index} event={event}/>
          })}
        </CardContent>
      </Card>
    </section>
  )
}
