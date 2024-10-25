import { TodaysMeetings } from "@/components/charts/todays-meetings";
import { WeeksMeetings } from "@/components/charts/weeks-meetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventService } from "@/server/service/EventService";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const eventService: EventService = new EventService();
  const user = await currentUser();
  const eventsOrganizedByUser = await eventService.getAllEventsRelatedToUser(user!.id);

  return (
    <main className="grid grid-cols-12 grid-rows-4 gap-4 p-4">
      <WelcomeCard className="hidden md:block md:col-span-4 lg:col-span-6" username={(user!.username)!}/>
      <TodaysMeetings chartData={[{meetings: `${eventsOrganizedByUser.length}`}]} className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <WeeksMeetings chartData={[{meetings: `${eventsOrganizedByUser.length}`}]} className="hidden md:block md:col-span-4 lg:col-span-3"/>
      <ExampleCard className="row-span-2 col-span-12 lg:row-span-3 lg:col-span-8"/>
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
function RecentActivityComponent({ activity } : { activity: RecentActivity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {activity?.username}
        </CardTitle>
        <CardDescription>
          {
            function() {
              let result;
              if (activity.role === "attendee") {
                result = "has registered for " + activity.event;
              }
              else if (activity.role === "admin") {
                result = "was given admin permission for " + activity.event;
              }
              else {
                result = "created " + activity.event;
              }
              return <p>{result}</p>
            }()
          }
        </CardDescription>
      </CardHeader>
    </Card>
  )
}