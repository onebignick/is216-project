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

const formSchema = z.object({
    eventName: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date(),
})

export function CreateEventForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const newEvent: MeetgridEvent = {
            name: values.eventName,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
            organizerId: null,
            reminder: null,
        }

        const response = await fetch("/api/event/create", {
            method: "POST",
            body: JSON.stringify(newEvent),
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.log("An error occured");
        }
    }

    return(
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardHeader>
                        <CardTitle>Create an event</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="eventName"
                            render={({field}) => (
                                <FormItem>
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
                                <FormItem>
                                    <FormControl>
                                        <Textarea placeholder="Tell us more about your event" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-evenly">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({field}) => (
                                    <FormItem>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn("w=[240px] pl-3 text-left fonr-normal", !field.value && "text-muted-foreground")}>
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
                                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                                    <FormItem>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn("w=[240px] pl-3 text-left fonr-normal", !field.value && "text-muted-foreground")}>
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
                                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </CardContent>
                </form>
            </Form>
        </Card>
    )
}