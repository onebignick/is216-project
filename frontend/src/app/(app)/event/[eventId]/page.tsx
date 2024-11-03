import { EventService } from "@/server/service/EventService"
import { BookingService } from "@/server/service/BookingService";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { AvailabilityCard } from "@/components/availability-card";
import { MeetgridEvent } from "@/server/entity/event";

export default async function EventPage({params}: {params: {eventId:string}}) {
    const eventService: EventService = new EventService();
    const eventInformation = await eventService.getOneEventById(params.eventId);

    const bookingService = new BookingService();
    const participantsInformation = await bookingService.getOneBookEventById(eventInformation![0].eventCode!);

    return (
        <div className="grid grid-cols-12 gap-4 p-4">
            <InviteCard event={eventInformation![0]} className="col-span-12"/>
            <AvailabilityCard eventInformation={eventInformation![0]} participantsInformation={participantsInformation} className="col-span-12"/>
            <InviteCard event={eventInformation![0]}  className="col-span-12"/>
            <AvailabilityCard eventInformation={eventInformation![0]} participantsInformation={participantsInformation} className="col-span-12"/>
            <ExampleCard className="hidden lg:block col-span-12"/>
            <AdminCard className="col-span-12" event={eventInformation![0]}/>
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

function InviteCard({ className, event } : {className:string, event: MeetgridEvent}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Welcome to {event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Invite people to join your event with this code : {event.eventCode}</p>
      </CardContent>
    </Card>
  )
}

function AdminCard({ className, event }: { className: string, event: MeetgridEvent}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          Add collaborators to this meeting
        </CardTitle>
      </CardHeader>
      <CardContent>
               
      </CardContent>
    </Card>
  )
}