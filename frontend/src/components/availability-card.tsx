"use client"
import { Availability } from "@/components/ui/availability";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { MeetgridEvent } from "@/server/entity/event";
import { MeetgridBookEvent } from "@/server/entity/booking"; // need to change the name
import { GroupAvailability } from "./ui/groupAvailability";
import { InterviewNotes } from "../components/notes/interview-notes";
import { SettingsForm } from "./forms/settings-form";

interface AvailabilityCardProps {
  className: string;
  eventInformation: MeetgridEvent;
  participantsInformation: MeetgridBookEvent;
}

export function AvailabilityCard({ className, eventInformation, participantsInformation } : AvailabilityCardProps) {
  
  return (
    <Card className={className}>
      <Tabs defaultValue="group">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="group">Group Availability</TabsTrigger>
          <TabsTrigger value="individual">Your Availability</TabsTrigger>
          <TabsTrigger value="interviews">Interviews Notes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="group">
            <CardHeader>
              <CardTitle>Group Availability</CardTitle>
              <CardDescription>Shows availability across your group</CardDescription>
            </CardHeader>
            <CardContent>
              <GroupAvailability period={15} eventInformation={eventInformation}/>
            </CardContent>
        </TabsContent>
        <TabsContent value="individual">
            <CardHeader>
              <CardTitle>Your Availability</CardTitle>
              <CardDescription>Click and drag to indicate your availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Availability eventInformation={eventInformation}/>
            </CardContent>
        </TabsContent>
        <TabsContent value="interviews">
          <CardHeader>
              <CardTitle>Participants Interview Notes</CardTitle>
              <CardDescription>Enter participants details answer here</CardDescription>
          </CardHeader>
          <CardContent>
              <InterviewNotes participantsInformation={participantsInformation} />
          </CardContent>
      </TabsContent>
        <TabsContent value="settings">
          <SettingsCard event={eventInformation}/>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function SettingsCard({event} : {event: MeetgridEvent}) {
  return(
    <>
      <CardHeader>
        <CardTitle>Your event settings</CardTitle>
        <CardDescription>View and edit your settings here</CardDescription>
      </CardHeader>
      <CardContent>
        <SettingsForm event={event}/>
      </CardContent>
    </>
  )
}