import { EventService } from "@/server/service/EventService"
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Availability } from "@/components/ui/availability";

export default async function EventPage({params}: {params: {eventId:string}}) {
    const eventService: EventService = new EventService();
    const eventInformation = await eventService.getOneEventById(params.eventId);
    return (
        <div className="grid grid-cols-12 gap-4">
            <InviteCard eventCode={eventInformation![0].eventCode!} className="col-span-12"/>
            <ExampleCard className="hidden lg:block col-span-3"/>
            <Card1 className="col-span-12 md:col-span-6"/>
            <Card1 className="col-span-12 md:col-span-6"/>
            {eventInformation![0].eventCode}
        </div>
    )
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

function InviteCard({ className, eventCode } : {className:string, eventCode: string}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Welcome to Example event</CardTitle>
        <CardDescription>Invite your friends to this page</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Invite your friends now</Button>
        <p>Invite people to join your event with this code : {eventCode}</p>
      </CardContent>
    </Card>
  )
}

function Card1({ className } : {className:string}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>Indicate your availability here</CardDescription>
      </CardHeader>
      <CardContent>
        <Availability days={5} period={15}/>
      </CardContent>
    </Card>
  )
}