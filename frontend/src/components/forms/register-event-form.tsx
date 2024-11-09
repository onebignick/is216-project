"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    eventCode: z.string(),
})


export function RegisterEventForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {

        const targetEventResponse = await fetch("/api/event?" + new URLSearchParams({
            code: values.eventCode,
        }))

        if (targetEventResponse.ok) {
            const { targetEvent } = await targetEventResponse.json();
            router.push("/event/" + targetEvent.id + "/register");
        }


        // const newBookEvent: MeetgridBookEvent = {
        //     name: values.name,
        //     date: values.date.toString(),
        //     time: null, // Put null first as database is timestamp?
        //     notes: null,
        //     status: null,            
        //     participantId: user!.id,
        //     eventCode: values.eventCode
        // }

        // const response = await fetch("/api/Bookevent/create", {
        //     method: "POST",
        //     body: JSON.stringify(newBookEvent),
        // })

        // if (response.ok) {
        //     // todo : generate code
        //     const data = await response.json();
        //     console.log(data);
        //     router.push(`/event/register/success`); // Pass the event code to the success page
        // } else {
        //     console.log("An error occured");
        // }
    }

    return(
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className = "text-center">Register for an event</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="eventCode"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Input placeholder="Enter the event code here" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="col-span-2">
                            Submit
                        </Button>
                    </CardContent>
                </form>
            </Form>
        </Card>
    )
}