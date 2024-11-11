"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    meetingPeriod: z.coerce.number(),
})

const durations = [
    {
        id: "15",
        label: "15 minutes",
    },
]

export function CreateEventForm() {
    
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // create new event with defaults
        const newEvent = {
            name: values.name,
            description: values.description,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            meetingPeriod: values.meetingPeriod,
            startTimeMinutes: 540,
            endTimeMinutes: 1080,
        } as MeetgridEvent

        const createdEventResponse = await fetch("/api/event", {
            method: "POST",
            body: JSON.stringify(newEvent),
        });

        // if event was created
        if (createdEventResponse.ok) {

            const { events } = await createdEventResponse.json();           
            if (events.length == 0) return;

            const createdEvent: MeetgridEvent = events[0];

            toast({
                title: "Event Successfully created!",
                description: "You will be redirected to the event page in 3 seconds",
                className: "bg-green-500 text-black",
            })

            setTimeout(() => {
                router.push("/event/" + createdEvent.id)
            }, 3000);
        }
        setIsLoading(false);
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className = "text-center">Create an Interview Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Input placeholder="Enter the name of your interview here" {...field} />
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
                                        <Textarea placeholder="Tell us more about your interview" {...field}/>
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
                        <FormField
                            control={form.control}
                            name="meetingPeriod"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel>Select interview duration</FormLabel>
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the duration of each interview" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {durations.map((item) => {
                                            return <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
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
                    </CardContent>
                </form>
            </Form>
        </Card>
    )
}