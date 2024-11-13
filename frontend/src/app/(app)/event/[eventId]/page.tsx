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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { TabsTrigger } from "@radix-ui/react-tabs";
import { AdminDataTable } from "@/components/datatables/admin/AdminDataTable";
import { AdminDataTableColumns } from "@/components/datatables/admin/AdminDataTableColumns";
import { MeetgridEventAdmin } from "@/types/MeetgridEventAdmin";
import { MeetgridEventRegistrantService } from "@/server/service/MeetgridEventRegistrantService";
import { MeetgridInterview } from "@/types/MeetgridInterview";
import { InterviewDataTable } from "@/components/datatables/interview/InterviewDataTable";
import { InterviewDataTableColumns } from "@/components/datatables/interview/InterviewDataTableColumns";
import { CreateQuestionForm } from "@/components/forms/CreateQuestionForm";
import { QuestionDisplayCard } from "@/components/questionDisplayCard";


export default async function EventPage({params}: {params: {eventId:string, bookId:string}}) {
  const user = auth();

  const userObj = await clerkClient.users.getUser(user.userId!);
  const meetgridEventService: MeetgridEventService = new MeetgridEventService();
  const meetgridEventParticipantService: MeetgridEventParticipantService = new MeetgridEventParticipantService();
  const meetgridEventRegistrantService: MeetgridEventRegistrantService = new MeetgridEventRegistrantService();

  try {
    const meetgridEventArray = await meetgridEventService.findById(params.eventId);

    if (meetgridEventArray.length === 0) throw new Error("event not found");

      const meetgridEvent: MeetgridEvent = meetgridEventArray[0];
      const totalAvailability: MeetgridEventParticipant[] = await meetgridEventParticipantService.findByEventId(params.eventId);
      const currentUserAvailability: MeetgridEventParticipant[] = await meetgridEventParticipantService.findByEventIdAndUserId(params.eventId, user.userId!);
      const totalAdmins: MeetgridEventAdmin[] = await meetgridEventParticipantService.findByEventIdAndRole(params.eventId, "admin")
      const totalRegistrants: MeetgridInterview[] = await meetgridEventRegistrantService.findByEvent(params.eventId);

      if (totalAvailability.length === 0) throw new Error("No availability found");

      return (
        <div>
          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="info">Event Information</TabsTrigger>
              <TabsTrigger value="registration">Participants</TabsTrigger>
              <TabsTrigger value="questions">Interview Questions</TabsTrigger>
              <TabsTrigger value="admin">Manage Admins</TabsTrigger>
            </TabsList>


            <div className="mt-8">        
              <TabsContent value="info">
                <div className="grid grid-cols-12 gap-4 p-4">
                  <Card className="col-span-12 md:col-span-6">
                    <CardHeader>
                      <CardTitle>Welcome to {meetgridEvent.name}</CardTitle>
                      <CardDescription>Click below to add admins to your meeting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormDialogButton
                        title="Invite people to run your meeting!"
                        description="Fill in the form below with the person's email"
                        label="Add Admins"
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
                    </CardContent>
                  </Card>

                  <Card className="col-span-12 lg:col-span-6">
                    <CardHeader>
                      <CardTitle>View your groups availability here</CardTitle>
                      <CardDescription>Hover over to see who is available</CardDescription>
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
              </TabsContent>

              <TabsContent value="registration">
                <div className="grid grid-cols-12 gap-4 p-4">
                  <Card className="col-span-12">
                    <CardHeader>
                      <CardTitle>Registered Interviews</CardTitle>
                      <CardDescription>Shows all people who have registered for this interview plan</CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-x-auto">
                      <InterviewDataTable columns={InterviewDataTableColumns} data={totalRegistrants}/>
                    </CardContent>
                  </Card>
                </div>

              </TabsContent>

              <TabsContent value="questions">
                <div className="grid grid-cols-12 gap-4 p-4">
                  <Card className="col-span-12">
                    <CardHeader>
                      <CardTitle>Add a new Question</CardTitle>
                      <CardDescription>Use this form to add a new Question</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormDialogButton
                        title="Add a new question"
                        description="Fill in the form to add a new question"
                        label="Add Question"
                        form={<CreateQuestionForm eventId={params.eventId} length={0}/>}
                      />
                    </CardContent>
                  </Card>
                  <Card className="col-span-12">
                    <CardHeader>
                      <CardTitle>Current Interview Questions</CardTitle>
                      <CardDescription>Below are the interview questions for this interview plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <QuestionDisplayCard eventId={params.eventId}/>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="admin">
                <div className="grid grid-cols-12 gap-4 p-4">
                  <Card className="col-span-12">
                    <CardHeader>
                      <CardTitle>Add a New Admin</CardTitle>
                      <CardDescription>Use this form to add a new admin</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormDialogButton
                        title="Invite people to run your meeting!"
                        description="Fill in the form below with the person's email"
                        label="Add Admins"
                        form={<AddAdminToEventForm eventId={params.eventId}/>}
                      />
                    </CardContent>
                  </Card>
                  <Card className="col-span-12">
                    <CardHeader>
                      <CardTitle>Your Interview Admins</CardTitle>
                      <CardDescription>Manage your admins here</CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-x-auto">
                      <AdminDataTable columns={AdminDataTableColumns} data={totalAdmins}/>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )
  } catch {
    return <p>An error occured</p>
  }
}