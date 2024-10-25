import { EventService } from "@/server/service/EventService"
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Availability } from "@/components/ui/availability";

export default async function EventPage({params}: {params: {eventId:string}}) {
    const eventService: EventService = new EventService();
    const eventInformation = await eventService.getOneEventById(params.eventId);
    return (
        <div>
            <ExampleCard className=""/>
            <InviteCard className=""/>
            <Card1 className=""/>
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


function InviteCard({ className } : {className:string}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Welcome to Example event</CardTitle>
        <CardDescription>Invite your friends to this page</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Invite your friends now</Button>
        Invite people to join your event with this code :XXXXX
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