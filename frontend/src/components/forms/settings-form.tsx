"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectValue, SelectItem, SelectTrigger } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { MeetgridEvent } from "@/server/entity/event";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { format } from 'date-fns'; // Add this line
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import React from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    eventName: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    startHour: z.coerce.number(),
    startMinute: z.coerce.number(),
    endHour: z.coerce.number(),
    endMinute: z.coerce.number(),
    participantNum: z.string(),
    reminder:  z.string().optional(), // New field for reminder  
}).refine(data => {
    // Validate that end date is after start date
    return data.endDate > data.startDate;
}, {
    message: "End date must be later than start date.",
    path: ["endDate"],
}).refine(data => {
    const startTime = data.startHour * 60 + data.startMinute;
    const endTime = data.endHour * 60 + data.endMinute;

    return endTime > startTime;
}, {
    message: "End time must be later than start time.",
    path: ["endHour"],
});

interface SettingsFormInterface {
    event: MeetgridEvent;
}

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    event: MeetgridEvent; // You can replace 'any' with a more specific type for the event
}

const toDate = (date: string | Date | null | undefined): Date => {
    if (!date) return new Date(); // Fallback to current date if no value
    return typeof date === "string" ? new Date(date) : date; // Handle string and Date
};


export function SettingsForm({ event } : SettingsFormInterface) {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter(); // Initialize useRouter

    const startDate = toDate(event.startDate);
    const reminderDate = toDate(event.reminder);
    // Calculate days difference only if both dates are defined
    const reminderDays = startDate && reminderDate
    ? Math.round((startDate.getTime() - reminderDate.getTime()) / (24 * 60 * 60 * 1000)).toString()
    : "No reminder set";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eventName: event.name || "",
            description: event.description || "",
            startDate: toDate(event.startDate), // Correctly use event.startDate
            endDate: toDate(event.endDate), // Correctly use event.endDate
            startHour: Math.floor(event.startTime! / 60) || 0,
            startMinute: event.startTime! % 60 || 0,
            endHour: Math.floor(event.endTime! / 60) || 0,
            endMinute: event.endTime! % 60 || 0,
            participantNum: event.participantNum || "",
            reminder: reminderDays, // Set the reminder days as string
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const startTime = values.startHour * 60 + values.startMinute;
        const endTime = values.endHour * 60 + values.endMinute;

        // Convert reminder to a number (assuming it's in days)
        const reminderValue = values.reminder !== undefined && values.reminder !== null 
        ? Number(values.reminder) 
        : undefined;
      
        // Calculate the reminder date based on the start date and reminder in days
        const reminderDate = reminderValue 
        ? new Date(values.startDate.getTime() - reminderValue * 24 * 60 * 60 * 1000) // Convert days to milliseconds
        : null; // Set to null if no reminder is specified

        // const newEvent = {...event};
        // newEvent.startTime = startTime;
        // newEvent.endTime = endTime;
        const newEvent = {
            ...event,
            name: values.eventName,
            description: values.description,
            startTime: startTime,
            endTime: endTime,
            participantNum: values.participantNum,
            reminder: reminderDate,
            startDate: values.startDate.toString(),
            endDate: values.endDate.toString(),
        };

        const res = await fetch("/api/event", {
            method: "PUT",
            body: JSON.stringify({
                updatedEvent: newEvent
            })
        })       
        const response = await res.json();
        console.log(response);

        if (response.message === "success") {
            setSuccessMessage("Event updated successfully!");
            console.log("success");
        } else {
            // Handle case where success is false
            setSuccessMessage("Failed to update event.");
        }
    }

    console.log(event);

    // Handle delete function
    const handleDelete = async () => {
        const res = await fetch(`/api/event/delete/${event.id}`, {
            method: "DELETE",
        });
    
        const response = await res.json();
        console.log("API Response:", response); // Log the response to see if deletion was successful
    
        if (response.message === "Event deleted successfully") {
            // Redirect to the success page
            console.log(response);
            router.push(`/event/delete/success?eventName=${event.name}`); // Redirect without useRouter
            setSuccessMessage("Event deleted successfully!");
            setErrorMessage("");
            setShowDeleteModal(false); // Close the modal after deletion
        } else {
            console.log("An error occurred");
            setSuccessMessage("");
            setErrorMessage("Failed to delete event.");
        }
    };

    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className = "grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className = "col-span-2">
                            <CardHeader>
                                <CardTitle>Event Name</CardTitle>
                                <CardDescription>Your event name</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="eventName"
                                    render={({field}) => (
                                        <FormItem className="col-span-2">
                                            <FormControl>
                                                <Input placeholder="Event name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Card className = "col-span-2">
                            <CardHeader>
                                <CardTitle>Event Description</CardTitle>
                                <CardDescription>Your event description</CardDescription>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                        <Card className = "col-span-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Event Reminder Days</CardTitle>
                                <CardDescription>Your Remind Participants Days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="reminder"
                                    render={({field}) => (
                                        <FormItem className="col-span-2">
                                            <FormControl>
                                                <Input placeholder="Event name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Card className = "col-span-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Event Participants Number</CardTitle>
                                <CardDescription>Your event total number of participants</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="participantNum"
                                    render={({field}) => (
                                        <FormItem className="col-span-2">
                                            <FormControl>
                                                <Input placeholder="Event name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className = "col-span-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Event Start Date</CardTitle>
                                <CardDescription>Your event start date</CardDescription>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                        <Card className = "col-span-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Event end Date</CardTitle>
                                <CardDescription>Your event end date</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({field}) => (
                                        <FormItem className="col-span-2 sm:col-span-1">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a end date</span>}
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
                            </CardContent>
                        </Card>
                        <Card className = "col-span-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Event Start Time</CardTitle>
                                <CardDescription>Your event start time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startHour"
                                        render={({field}) => (
                                            <FormItem className="col-span-1">
                                                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select start hour"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {[...Array(24)].map((_, i) => (
                                                            <SelectItem key={i} value={i.toString()}>
                                                                {i.toString().padStart(2, "0")}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="startMinute"
                                        render={({field}) => (
                                            <FormItem className="col-span-1">
                                                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select start minute"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">00</SelectItem>
                                                        <SelectItem value="15">15</SelectItem>
                                                        <SelectItem value="30">30</SelectItem>
                                                        <SelectItem value="60">45</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className = "col-span-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Event End Time</CardTitle>
                                <CardDescription>Your event end time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="endHour"
                                        render={({field}) => (
                                            <FormItem className="col-span-1">
                                                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select end hour"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {[...Array(24)].map((_, i) => (
                                                                <SelectItem key={i} value={i.toString()}>
                                                                    {i.toString().padStart(2, "0")}
                                                                </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endMinute"
                                        render={({field}) => (
                                            <FormItem className="col-span-1">
                                                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select end minute"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">00</SelectItem>
                                                        <SelectItem value="15">15</SelectItem>
                                                        <SelectItem value="30">30</SelectItem>
                                                        <SelectItem value="60">45</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                            </CardContent>
                        </Card>
                    </div>    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">    
                         { successMessage &&
                            <div className="col-start-4 col-span-1 px-4 py-2 bg-green-200 text-white rounded col-span-1">          
                                <div className="text-green-600 text-center">{successMessage}</div>
                            </div>
                        }
                        { errorMessage &&
                            <div className="col-start-4 col-span-1 py-2 px-2 bg-red-200 text-white rounded col-span-1">          
                                <div className="text-red-600 text-center">{errorMessage}</div>
                            </div>
                        }      
                    </div>  
                    <div className = "grid md:grid-cols-2 lg:grid-cols-4 gap-4">              
                        <Button 
                            type="button" 
                            onClick={() => setShowDeleteModal(true)} 
                            className="px-4 py-2 bg-red-600 text-white rounded col-span-1">
                            Delete Event
                        </Button>
                        <Button type="submit" className="px-4 py-2 col-start-4 rounded col-span-1">Save Changes</Button>
                    </div>

  
                </form>
                
            </Form>
            <DeleteModal 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                onConfirm={handleDelete} 
                event={event} 
            />
        </div>
    )
}

// Modal Component
const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, event }) => {
    // Ensure you check for the correct prop (isOpen instead of show)
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-xl font-bold text-center">Confirm Deletion</h3>
                <br></br>
                <p>Are you sure you want to delete <b>{event.name}</b> Event?</p>
                <br></br>
                <p className="text-center">This action cannot be undone.</p>
                <br></br>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onClose} className="col-span-1 mr-4 px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="col-span-1 px-4 py-2 bg-red-500 text-white rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;