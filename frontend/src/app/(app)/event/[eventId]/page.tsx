import { EventService } from "@/server/service/EventService"
import { BookingService } from "@/server/service/BookingService";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvailabilityCard } from "@/components/availability-card";

export default async function EventPage({params}: {params: {eventId:string}}) {
    const eventService: EventService = new EventService();
    const eventInformation = await eventService.getOneEventById(params.eventId);

    const bookingService = new BookingService();
    const participantsInformation = await bookingService.getOneBookEventById(eventInformation![0].eventCode!);

    return (
        <div className="grid grid-cols-12 gap-4 p-4">
            <InviteCard eventCode={eventInformation![0].eventCode!} eventName={eventInformation![0].name!}  className="col-span-12"/>
            <AvailabilityCard eventInformation={eventInformation![0]} participantsInformation={participantsInformation} className="col-span-12"/>
            <ExampleCard className="hidden lg:block col-span-12"/>
            <AdminCard/>
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

function InviteCard({ className, eventCode, eventName } : {className:string, eventCode: string, eventName: string}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Welcome to {eventName} event</CardTitle>
        <CardDescription>Invite your friends to this page</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Invite people to join your event with this code : {eventCode}</p>
        <br></br>
        <Button>Invite your friends now</Button>
      </CardContent>
    </Card>
  )
}

function AdminCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          This is the admin Card
        </CardTitle>
      </CardHeader>
    </Card>
  )
}