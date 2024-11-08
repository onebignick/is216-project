"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";

const formSchema = z.object({
    username: z.string(),
})

interface AddAdminToEventFormProps {
    eventId: string;
}

export function AddAdminToEventForm({ eventId } : AddAdminToEventFormProps) {
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const targetUserResponse = await fetch("/api/user?" + new URLSearchParams({
            username: values.username,
        }))

        if (targetUserResponse.ok) {
            const { targetUser } = await targetUserResponse.json();
            console.log(targetUser)

            const eventParticipantToCreate = {
                eventId: eventId,
                userId: targetUser.clerkUserId,
                role: "admin",
                availabilityString: "",
            } as MeetgridEventParticipant;

            const addUserToEventResponse = await fetch("/api/eventParticipant", {
                method: "POST",
                body: JSON.stringify(eventParticipantToCreate)
            })

            if (addUserToEventResponse.ok) {
                toast({
                    title: "Person added!",
                    description: "We managed to add this user!"
                })
            } else {
                toast({
                    title: "Uh oh! Something went wrong",
                    description: "Something went wrong when adding this user, try again"
                })
            }
        } else {
            toast({
                title: "Uh oh! Something went wrong",
                description: "Seems like this user does not exist"
            })
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg">
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Enter a username here" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">Add User</Button>
            </form>
        </Form>
    )
}