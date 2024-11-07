import { EventService } from "@/server/service/EventService"
import { BookingService } from "@/server/service/BookingService";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { AvailabilityCard } from "@/components/availability-card";
import { MeetgridEvent } from "@/server/entity/event";
import { QuestionService } from "@/server/service/QuestionService";


export default async function EventPage({params}: {params: {eventId:string, bookId:string}}) {
    const eventService: EventService = new EventService();
    const eventInformation = await eventService.getOneEventById(params.eventId);

    const bookingService = new BookingService();
    const participantsInformation = await bookingService.getOneBookEventById(eventInformation![0].eventCode!);


    const questionService: QuestionService = new QuestionService();
    const eventQuestions = await questionService.getAllQuestionsRelatedToNotes(params.bookId);

    return (
        <div className="grid grid-cols-12 gap-4 p-4">
            <InviteCard event={eventInformation![0]} className="col-span-12"/>
            <AvailabilityCard eventInformation={eventInformation![0]} participantsInformation={participantsInformation} eventQuestions={eventQuestions} className="col-span-12"/>
            <ExampleCard className="hidden lg:block col-span-12"/>
            <AdminCard className="col-span-12" event={eventInformation![0]}/>
           
        </div>
    )
}


function ExampleCard({ className } : {className:string}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Question</CardTitle>
        <CardDescription>This is a test</CardDescription>
      </CardHeader>
      <CardContent>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor, exercitationem harum? Eos ullam a sed culpa cumque! Tempora voluptatibus laudantium impedit, excepturi iure ullam explicabo et nesciunt. Repudiandae, ratione deleniti?
      </CardContent>
    </Card>
  )
}

function InviteCard({ className, event } : {className:string, event: MeetgridEvent}) {
  const zoomLink = "https://smu-sg.zoom.us/j/96930333437?pwd=CeObmi1R8m1pICDs8faWPzEzngjGmD.1"; //replace with API
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Welcome to {event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Invite people to join your event with this code : {event.eventCode}</p>
        <p>Zoom link: {zoomLink}</p>
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