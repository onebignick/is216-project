import { ParticipantAvailability } from "@/components/ui/participantAvailability";
import { EventService } from "@/server/service/EventService";
import { MeetGridAvailabilityService } from "@/server/service/MeetgridAvailabilityService";

const meetgridAvailabilityService: MeetGridAvailabilityService = new MeetGridAvailabilityService();
const eventService: EventService = new EventService();

export default async function RegisterEventPage({ params }: {params: {eventId: string}}) {
    const availability = await meetgridAvailabilityService.getTotalEventAvailability(params.eventId);
    const eventInformation = await eventService.getOneEventById(params.eventId);

    return (
        <div>
            <ParticipantAvailability availability={availability} eventInformation={eventInformation![0]}/>
        </div>
    )
}