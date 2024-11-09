import { BookingService } from "@/server/service/BookingService";
import { AvailabilityCard } from "@/components/availability-card";
import { QuestionService } from "@/server/service/QuestionService";

import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";
import { MeetgridEvent } from "@/server/entity/MeetgridEvent";

import { MeetgridEventService } from "@/server/service/MeetgridEventService";
import { MeetgridEventParticipantService } from "@/server/service/MeetgridEventParticipantService";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { FormDialogButton } from "@/components/FormDialogButton";
import { AddAdminToEventForm } from "@/components/forms/AddAdminToEventForm";
import { DisplayTotalAvailability } from "@/components/DisplayTotalAvailability";
import IndicateAvailability from "@/components/IndicateAvailability";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/forms/settings-form";


// const eventService: EventService = new EventService();
// const eventInformation = await eventService.getOneEventById(params.eventId);

// const bookingService = new BookingService();
// const participantsInformation = await bookingService.getOneBookEventById(eventInformation![0].eventCode!);


// const questionService: QuestionService = new QuestionService();
// const eventQuestions = await questionService.getAllQuestionsRelatedToNotes(params.bookId);
export default async function EventPage({params}: {params: {eventId:string, bookId:string}}) {
  const user = auth();

  const userObj = await clerkClient.users.getUser(user.userId!);
  const meetgridEventService: MeetgridEventService = new MeetgridEventService();
  const meetgridEventParticipantService: MeetgridEventParticipantService = new MeetgridEventParticipantService();

  try {
    const meetgridEventArray = await meetgridEventService.findById(params.eventId);

    if (meetgridEventArray.length === 0) throw new Error("event not found");

      const meetgridEvent: MeetgridEvent = meetgridEventArray[0];
      const totalAvailability: MeetgridEventParticipant[] = await meetgridEventParticipantService.findByEventId(params.eventId);
      const currentUserAvailability: MeetgridEventParticipant[] = await meetgridEventParticipantService.findByEventIdAndUserId(params.eventId, user.userId!);

      if (totalAvailability.length === 0) throw new Error("No availability found");

      return (
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-12 md:col-span-6">
            <CardHeader>
              <CardTitle>Welcome to {meetgridEvent.name}</CardTitle>
              <CardDescription>Click below to add admins to your meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <FormDialogButton
                title="Invite people to run your meeting!"
                description="Fill in the form below with the person's email"
                label="Add admins"
                form={<AddAdminToEventForm eventId={params.eventId}/>}
              />
            </CardContent>
          </Card>

          <Card className="col-span-12 md:col-span-6">
            <CardHeader>
              <CardTitle>Invite people to register for your event</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Invite people to join with the code <code>{meetgridEvent.code}</code></p>
              <p>Or use ask them to sign up with this link<code></code></p>

            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-6">
            <CardHeader>
              <CardTitle>View your groups availability here</CardTitle>
              <CardDescription>Hover over the cards to see who is available</CardDescription>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <DisplayTotalAvailability totalAvailability={totalAvailability} event={meetgridEvent}/>
            </CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-6">
            <CardHeader>
              <CardTitle>Indicate your availability</CardTitle>
              <CardDescription>Use this tool below to indicate your availability</CardDescription>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto">
              <IndicateAvailability eventParticipant={currentUserAvailability[0]} event={meetgridEvent} userEmail={userObj.emailAddresses[0].emailAddress}/>
            </CardContent>
          </Card>
          <Card className="col-span-12">
            <CardHeader>
              <CardTitle>Edit your event settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsForm event={meetgridEvent}/>
            </CardContent>
          </Card>
        </div>
      )
  } catch {
    return <p>An error occured</p>
  }
}
    // return (
    //     <div className="grid grid-cols-12 gap-4 p-4">
    //         <InviteCard event={eventInformation![0]} className="col-span-12"/>
    //         <AvailabilityCard eventInformation={eventInformation![0]} participantsInformation={participantsInformation} eventQuestions={eventQuestions} className="col-span-12"/>
    //         {/* <ExampleCard className="hidden lg:block col-span-12"/> */}
    //         <AdminCard className="col-span-12" event={eventInformation![0]}/>
           
    //     </div>
    // )


// function ExampleCard({ className } : {className:string}) {
//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle>Question</CardTitle>
//         <CardDescription>This is a test</CardDescription>
//       </CardHeader>
//       <CardContent>
//         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor, exercitationem harum? Eos ullam a sed culpa cumque! Tempora voluptatibus laudantium impedit, excepturi iure ullam explicabo et nesciunt. Repudiandae, ratione deleniti?
//       </CardContent>
//     </Card>
//   )
// }

// function InviteCard({ className, event } : {className:string, event: MeetgridEvent}) {
//   const zoomLink = "https://smu-sg.zoom.us/j/96930333437?pwd=CeObmi1R8m1pICDs8faWPzEzngjGmD.1"; //replace with API
//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle>Welcome to {event.name}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p>Invite people to join your event with this code : {event.eventCode}</p>
//         <p>Zoom link: {zoomLink}</p>
//       </CardContent>
//     </Card>
//   )
// }

// function AdminCard({ className, event }: { className: string, event: MeetgridEvent}) {
//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle>
//           Add collaborators to this meeting
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
               
//       </CardContent>
//     </Card>
//   )
// }