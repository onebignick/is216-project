"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";
import { MeetgridEventRegistrant } from "@/server/entity/MeetgridEventRegistrant";

const formSchema = z.object({
    email: z.string().email("This is not a valid email"),
})

interface RegisterEventFormProps {
    mergedAvailability: {[key: string]: string}[][];
    event: MeetgridEvent
    timeslotIdx: number;
    dayIdx: number;
}

export function RegisterForTimeslotForm({ mergedAvailability, timeslotIdx, dayIdx, event }: RegisterEventFormProps) {

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    function formatDateToISOString(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {

        let eventParticipantEmailToFind = "";
        for (const key in mergedAvailability[timeslotIdx][dayIdx]) {
            if (mergedAvailability[timeslotIdx][dayIdx][key] != "") continue;
            mergedAvailability[timeslotIdx][dayIdx][key] = values.email;
            eventParticipantEmailToFind = key;
            break;
        }

        console.log(eventParticipantEmailToFind)

        //find the guy
        const targetUserResponse = await fetch("/api/user?" + new URLSearchParams({
            email: eventParticipantEmailToFind
        }));

        const { targetUser } = await targetUserResponse.json();

        // find the guys availability;
        const eventParticipantResponse = await fetch("/api/eventParticipant?" + new URLSearchParams({
            eventId: event.id!,
            userId: targetUser.clerkUserId
        }))
        const { eventParticipants } = await eventParticipantResponse.json()

        // update the guys availability
        const eventParticipantToUpdate: MeetgridEventParticipant = eventParticipants[0];
        const eventParticipantToUpdateAvailability = JSON.parse(eventParticipantToUpdate.availabilityString);
        eventParticipantToUpdateAvailability[timeslotIdx][dayIdx][eventParticipantEmailToFind] = values.email;
        eventParticipantToUpdate.availabilityString = JSON.stringify(eventParticipantToUpdateAvailability)

        const eventParticipantToUpdateResponse = await fetch("/api/eventParticipant", {
            method: "PUT",
            body: JSON.stringify(eventParticipantToUpdate)
        })
        console.log(await eventParticipantToUpdateResponse.json());
        
        // todo generate zoom code and email
        const eventStartDate = new Date(event.startDate);
        eventStartDate.setDate(eventStartDate.getDate() + dayIdx);
        eventStartDate.setMinutes(eventStartDate.getMinutes() + timeslotIdx*15)
        const createZoomMeetingResponse = await fetch("/api/zoom", {
            method: "POST",
            body: JSON.stringify({
                agenda: "Interview",
                topic: event.name,
                duration: 15,
                startDateTime: formatDateToISOString(eventStartDate),
            })
        })

        const { createdMeeting } = await createZoomMeetingResponse.json()

        // create new event registrant at with that timeslot
        const eventRegistrantToCreate = {
            interviewerEmail: eventParticipantEmailToFind,
            participantEmail: values.email,
            eventId: event.id,
            timeslotIdx: timeslotIdx,
            dayIdx: dayIdx,
            zoomLink: createdMeeting.start_url
        } as MeetgridEventRegistrant

        // record the info in db
        const createdEventRegistrantResponse = await fetch("/api/eventRegistrant", {
            method: "POST",
            body: JSON.stringify(eventRegistrantToCreate),
        })
        console.log(await createdEventRegistrantResponse.json())

        toast({
            title: "Successfully Registered for event",
            description: "You will receive an email with the details of the meeting",
            className: "bg-green-500 text-black",
        })
    }

    return(
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter email here" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Submit
                        </Button>
                </form>
            </Form>
    )
}