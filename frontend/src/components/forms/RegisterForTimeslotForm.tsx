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

    async function onSubmit(values: z.infer<typeof formSchema>) {

        let eventParticipantEmailToFind = "";
        for (const key in mergedAvailability[timeslotIdx][dayIdx]) {
            if (mergedAvailability[timeslotIdx][dayIdx][key] != "") continue;
            mergedAvailability[timeslotIdx][dayIdx][key] = values.email;
            eventParticipantEmailToFind = key;
            break;
        }

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
    }

    return(
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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