import { MeetgridEventService } from "@/server/service/MeetgridEventService";
import { MeetgridEventParticipantService } from "@/server/service/MeetgridEventParticipantService";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";
import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import RegisterForAvailableSessions from "@/components/RegisterForAvailableSessions";

export default async function RegisterForEvent({ params }: {params : { eventId: string}}) {

    const meetgridEventService: MeetgridEventService = new MeetgridEventService();
    const meetgridEventParticipantService: MeetgridEventParticipantService = new MeetgridEventParticipantService();

    try {
        const meetgridEventArray = await meetgridEventService.findById(params.eventId);
        if (meetgridEventArray.length === 0) throw new Error("event does not exist");

        const meetgridEvent: MeetgridEvent = meetgridEventArray[0];
        const totalAvailability: MeetgridEventParticipant[] = await meetgridEventParticipantService.findByEventId(params.eventId)       

        return(
            <div>
                <div>Welcome to {meetgridEvent.name}</div>
                <RegisterForAvailableSessions/>
            </div>
        )
    } catch {
        return <div>an error occured</div>
    }


}