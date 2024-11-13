import { MeetgridEventService } from "@/server/service/MeetgridEventService";
import { MeetgridEventParticipantService } from "@/server/service/MeetgridEventParticipantService";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";
import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import RegisterForAvailableSessions from "@/components/RegisterForAvailableSessions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RegisterForEvent({ params }: {params : { eventId: string}}) {

    const meetgridEventService: MeetgridEventService = new MeetgridEventService();
    const meetgridEventParticipantService: MeetgridEventParticipantService = new MeetgridEventParticipantService();

    try {
        const meetgridEventArray = await meetgridEventService.findById(params.eventId);
        if (meetgridEventArray.length === 0) throw new Error("event does not exist");

        const meetgridEvent: MeetgridEvent = meetgridEventArray[0];
        const totalAvailability: MeetgridEventParticipant[] = await meetgridEventParticipantService.findByEventId(params.eventId)       
        
        return(
            <div className="grid grid-cols-12 gap-4 p-4">
                <Card className="col-span-12">
                    <CardHeader>
                        <CardTitle>Welcome to {meetgridEvent.name}</CardTitle>
                        <CardDescription>Click below to register for a timeslot</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="col-span-12">
                    <CardHeader>
                        <CardTitle>Register for a timeslot here</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full overflow-x-auto">
                        <RegisterForAvailableSessions totalAvailability={totalAvailability} event={meetgridEvent}/>
                    </CardContent>
                </Card>
            </div>
        )
    } catch {
        return <div>an error occured</div>
    }


}