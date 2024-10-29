"use client"
import { Availability } from "@/components/ui/availability";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { MeetgridEvent } from "@/server/entity/event";
import { useEffect, useState } from "react";

interface AvailabilityCardProps {
  className: string;
  eventInformation: MeetgridEvent[];
}

export function AvailabilityCard({ className, eventInformation } : AvailabilityCardProps) {
  const currentEvent: MeetgridEvent = eventInformation[0];
  const eventAvailability: number[] = []
  currentEvent.eventAvailability!.split(",").map((stringToInt) => {
    eventAvailability.push(parseInt(stringToInt));
  })

  const [currentAvailability, setCurrentAvailability] = useState<number[]>(eventAvailability);
  
  return (
    <Card className={className}>
      <Tabs defaultValue="group">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="group">Group Availability</TabsTrigger>
          <TabsTrigger value="individual">Your Availability</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="group">
            <CardHeader>
              <CardTitle>Group Availability</CardTitle>
              <CardDescription>Shows availability across your group</CardDescription>
            </CardHeader>
            <CardContent>
              <Availability days={5} period={15} currentAvailability={currentAvailability} setCurrentAvailability={setCurrentAvailability} eventId={eventInformation[0].id!}/>
            </CardContent>
        </TabsContent>
        <TabsContent value="individual">
            <CardHeader>
              <CardTitle>Your Availability</CardTitle>
              <CardDescription>Click and drag to indicate your availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Availability days={5} period={15}/>
            </CardContent>
        </TabsContent>
        <TabsContent value="settings">
          <SettingsCard/>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function SettingsCard() {
  return(
    <>
      <CardHeader>
        <CardTitle>Your event settings</CardTitle>
        <CardDescription>View and edit your settings here</CardDescription>
      </CardHeader>
      <CardContent>
        abcde
      </CardContent>
    </>
  )
}