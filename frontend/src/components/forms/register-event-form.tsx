"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useUser } from "@clerk/nextjs";
import { MeetgridBookEvent } from "@/server/entity/booking";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    eventCode: z.string(),
    name: z.string(),
    date: z.date(),
    timeslot: z.string() // may need to change later
})

const availableTimeSlots = [ // sample timeslot. need to get from database later
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
];

export function RegisterEventForm() {
    const { user } = useUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const newBookEvent: MeetgridBookEvent = {
            name: values.name,
            date: values.date.toString(),
            time: null, // Put null first as database is timestamp?
            notes: null,
            status: null,            
            participantId: user!.id,
            eventCode: values.eventCode
        }

        const response = await fetch("/api/Bookevent/create", {
            method: "POST",
            body: JSON.stringify(newBookEvent),
        })

        if (response.ok) {
            // todo : generate code
            const data = await response.json();
            console.log(data);
            router.push(`/event/register/success`); // Pass the event code to the success page
        } else {
            console.log("An error occured");
        }
    }

    return(
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className = "text-center">Register an event</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="eventCode"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Input placeholder="Event name here" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Input placeholder="Your Name here" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({field}) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => {
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0); // Only compare date, not time
                                                    return date < today;
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="timeslot"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormControl>
                                        <select {...field} className="w-full border p-2 bg-background text-muted-foreground">
                                            <option value="">Select a timeslot</option>
                                            {availableTimeSlots.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
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