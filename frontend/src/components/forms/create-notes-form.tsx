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
import { CalendarIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
const timeSlots = [ // sample timeslot. need to get from database later
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
];

// Schema to validate inputs
const formSchema = z.object({
    eventId: z.string().min(1, "Event is required"),
    eventDate: z.date().refine(date => !isNaN(date.getTime()), {
        message: "Date is required", // Custom error message for invalid date
    }),
    eventTime: z
        .string()
        .min(1, "Time is required") // Updated to use min() for non-empty check
        .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
    notes: z.string().optional(),
    participantId: z.string().optional(),
});

interface EventPageProps {
    events: any[];
}

export default function NotesForm ({ events }: EventPageProps) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true); // Ensures component renders only on client side
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    
    const router = useRouter();
    const [interviewees, setInterviewees] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    //const [events, setEvents] = useState([]); // To hold events

    // Fetch events to select from
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events'); // Adjust endpoint as necessary
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data); // Assuming data is an array of events
                } else {
                    console.error("Failed to fetch events");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    // Fetch available dates for interviews when the event is selected
    const fetchAvailableDates = async (eventId: string) => {
        try {
            const response = await fetch(`/api/interviewDates?eventId=${eventId}`);
            if (response.ok) {
                const data = await response.json();
                setAvailableDates(data); // Set available dates from the API response
            } else {
                console.error("Failed to fetch available dates");
            }
        } catch (error) {
            console.error("Error fetching available dates:", error);
        }
    };

    // Fetch available time slots when the date is selected
    useEffect(() => {
        const fetchTimeSlots = async () => {
            const selectedDate = form.watch("eventDate");
            if (selectedDate) {
                const formattedDate = format(selectedDate, "yyyy-MM-dd");
                try {
                    const response = await fetch(`/api/timeSlots?date=${formattedDate}`);
                    if (response.ok) {
                        const data = await response.json();
                        setTimeSlots(data);
                    } else {
                        console.error("Failed to fetch time slots");
                    }
                } catch (error) {
                    console.error("Error fetching time slots:", error);
                }
            }
        };

        fetchTimeSlots();
    }, [form.watch("eventDate")]);

    async function fetchInterviewees(date: string, time: string) {
        try {
            const response = await fetch(`/api/interviewees?date=${date}&time=${time}`);
            if (response.ok) {
                const data = await response.json();
                setInterviewees(data);
            } else {
                console.error("Failed to fetch interviewees");
            }
        } catch (error) {
            console.error("Error fetching interviewees:", error);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedDate = format(values.eventDate, "yyyy-MM-dd");
        fetchInterviewees(formattedDate, values.eventTime);

        // Submit notes to the server
        const response = await fetch('/api/notes/create.route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: formattedDate,
                time: values.eventTime,
                notes: values.notes,
                participantId: values.participantId,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Note created successfully:", result);
        } else {
            console.error("Failed to create note");
        }
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardHeader>
                        <CardTitle className="text-center">Create Note</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {/* Event Selection */}
                        <FormField
                            control={form.control}
                            name="eventId"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <div>Select Event</div>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full border p-2 bg-background text-muted-foreground"
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                fetchAvailableDates(e.target.value); // Fetch dates for the selected event
                                            }}
                                        >
                                            <option value="" disabled>Select event</option>
                                            {events.map((event) => (
                                                <option key={event.id} value={event.id}>{event.name}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Date Field */}
                        <FormField
                            control={form.control}
                            name="eventDate"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <div>Date</div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    field.onChange(date);
                                                    const formattedDate = format(date, "yyyy-MM-dd");
                                                    fetchTimeSlots(formattedDate); // Fetch time slots for the selected date
                                                }}
                                                initialFocus
                                                disabledDates={availableDates} // Populate calendar with available dates
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Time Field */}
                        <FormField
                            control={form.control}
                            name="eventTime"
                            render={({ field }) => (
                                <FormItem className="col-span-2 sm:col-span-1">
                                    <FormControl>
                                        <div className="relative">
                                            <div>Time</div>
                                            <select
                                                {...field}
                                                className="w-full border p-2 bg-background text-muted-foreground"
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    if (e.target.value) {
                                                        const selectedDate = form.getValues("eventDate");
                                                        const formattedDate = format(selectedDate, "yyyy-MM-dd");
                                                        fetchInterviewees(formattedDate, e.target.value);
                                                    }
                                                }}
                                            >
                                                <option value="">Select time</option>
                                                {timeSlots.map((timeSlot) => (
                                                    <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                                                ))}
                                            </select>
                                            <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>    
                            )}
                        />


                        <Button type="submit" className="col-span-2">Load Interviewees</Button>

                        {/* Display Interviewees */}
                        {interviewees.length > 0 && (
                            <div className="col-span-2">
                                <h2 className="text-lg font-semibold mt-6">Interviewees</h2>
                                <ul>
                                    {interviewees.map((interviewee) => (
                                        <li key={interviewee.id} className="py-2 border-b">
                                            <div className="flex justify-between">
                                                <span>{interviewee.name}</span>
                                                <Input type="checkbox" value={interviewee.id} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </form>
            </Form>
        </Card>
    );
}
