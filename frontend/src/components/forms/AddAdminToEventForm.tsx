"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    email: z.string().email(),
})

interface AddAdminToEventFormProps {
    eventId: string;
}

export function AddAdminToEventForm({ eventId } : AddAdminToEventFormProps) {
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const targetUserResponse = await fetch("/api/user?" + new URLSearchParams({
            email: values.email,
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
                    description: "We managed to add this user!",
                    className: "bg-green-500 text-black",
                })
            } else {
                toast({
                    title: "Uh oh! Something went wrong",
                    description: "Something went wrong when adding this user, try again",
                    className: "bg-red-500 text-white", // Error color
                })
            }
        } else {
            toast({
                title: "Uh oh! Something went wrong",
                description: "Seems like this user does not exist"
            })
        }
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Enter an email here" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                { 
                    !isLoading ? 
                        <Button type="submit" className="col-span-2 bg-indigo-500 hover:bg-indigo-300">
                            Submit
                        </Button>
                    :
                        <Button disabled className="col-span-2 bg-indigo-300">
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button>
                }
            </form>
        </Form>
    )
}