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
    <main className="grid grid-cols-12 grid-rows-4 gap-4 p-4">
      {/* <HomePanel username={(user!.username)!} eventsOrganizedByUser={eventsOrganizedByUser}/> */}
      <WelcomeCard className="hidden md:block md:col-span-4 lg:col-span-6" username={(user!.username)!}/>
      <ExampleCard className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <ExampleCard className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <ExampleCard className="row-span-2 col-span-12 lg:row-span-3 lg:col-span-8"/>
      <ExampleCard className="row-span-2 col-span-12 lg:row-span-3 lg:col-span-4"/>
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
        Create a new event?
      </CardContent>
    </Card>
  )
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
