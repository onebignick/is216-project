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
import { Textarea } from "../ui/textarea";
import { MeetgridEvent } from "@/server/entity/event";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    eventName: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    participantNum: z.string(),
    reminder:  z.string().optional(), // New field for reminder
})

export function CreateEventForm() {
    const { user } = useUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const router = useRouter()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Convert reminder to a number (assuming it's in days)
        const reminderValue = values.reminder !== undefined && values.reminder !== null 
        ? Number(values.reminder) 
        : undefined;

        // Calculate the reminder date based on the start date and reminder in days
        const reminderDate = reminderValue 
        ? new Date(values.startDate.getTime() - reminderValue * 24 * 60 * 60 * 1000) // Convert days to milliseconds
        : null; // Set to null if no reminder is specified

        const defaultAvailability: number[] = Array(672).fill(0);

        const newEvent: MeetgridEvent = {
            name: values.eventName,
            eventCode: null,
            description: values.description,
            startDate: values.startDate.toString(),
            endDate: values.endDate.toString(),
            createdBy: user!.id,
            participantNum: values.participantNum.toString(),
            reminder: reminderDate,  // This should now be a Date or null
            eventAvailability: defaultAvailability.toString(),
        }

        const response = await fetch("/api/event/create", {
            method: "POST",
            body: JSON.stringify(newEvent),
        })

        if (response.ok) {
            // todo : generate code
            const data = await response.json();
            console.log(data);
            router.push(`/event/create/success?eventCode=${data.eventCode}`); // Pass the event code to the success page
        } else {
            console.log("An error occured");
        }
    }

    return(
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className = "text-center">Create an event</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="eventName"
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
                            name="description"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Textarea placeholder="Tell us more about your event" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({field}) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a start date</span>}
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
                            name="endDate"
                            render={({field}) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick an end date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                // Disable dates earlier than the selected startDate
                                                disabled={(date) => {
                                                    const startDate = form.getValues("startDate") || new Date();
                                                    startDate.setHours(0, 0, 0, 0); // Ensure only date part is compared
                                                    return date < startDate;
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {/* Reminder Field */}
                        <FormField
                            control={form.control}
                            name="reminder"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormControl>
                                        <Input type="number" placeholder="Reminder in days" {...field} min="0" max="30"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Participants Field */}
                        <FormField
                            control={form.control}
                            name="participantNum"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormControl>
                                        <Input type="number" placeholder="Number of Participants" {...field} min="1" max="10"/>
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