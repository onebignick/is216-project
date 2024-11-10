"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Props from '@toast-ui/react-calendar';

const Calendar = dynamic(() => import('@toast-ui/react-calendar'), { ssr: false });

interface EventPageProps {
    events: any[];
    className?: string;
}
// ../../node_modules/@toast-ui/react-calendar/types/index.d.ts
export default function FrontpageCalendar({ events, className}: EventPageProps){
    const [isClient, setIsClient] = useState(false);

    console.log(events);

    // const formattedEvents = events
    // .filter(event => {
    //     const endISO = convertDateToISO(event.endDate); // Convert end date to ISO format
    //     const endDate = new Date(endISO);
    //     endDate.setUTCDate(endDate.getUTCDate() + 1);
    //     return endDate >= new Date(); // Only include events that are not in the past
    // })
    // .map(event => {
    //     const startISO = convertDateToISO(event.startDate);
    //     const endISO = convertDateToISO(event.endDate);
    //     const startDate = new Date(startISO);
    //     const endDate = new Date(endISO);
    //     const isAllDay = true;

    //     if (isAllDay) {
    //         // console.log(event.name);
    //         // console.log(endDate.getUTCDate());
    //         endDate.setUTCHours(0, 0, 0, 0);
    //     }

    //     return {
    //         id: event.id,
    //         title: event.name || "Untitled Event",
    //         start: startISO,
    //         end: endDate.toISOString(), // Ensure end date is in ISO format
    //         allDay: false, // Mark as all-day
    //         description: event.description,
    //         eventCode: event.eventCode,
    //         backgroundColor: event.backgroundColor, // Random background color
    //         borderColor: event.borderColor,     // Random border color
    //         color: event.textColor, // Text color (white for readability)
    //         type: "event",
    //     };
    // });
    const startOfWeek = new Date(); 
    
    const formattedEvents = events
    .map(event => {
        
        const { startTime, endTime } = calculateEventTimes(
            startOfWeek,  // Base date (start of the week)
            event.eventRegistrant.dayIdx,  // Day index
            event.eventRegistrant.timeslotIdx,  // Timeslot index
            event.event.meetingPeriod  // Assume meeting duration is 15 minutes (you can adjust this as needed)
        );
       
        // Check if the event is all-day (i.e., no specific start/end time)
        const isAllDay = false; // You can adjust this condition based on your data
       
        // const { start, end } = convertToEventTimes(event.dayIdx, event.timeslotIdx, startOfWeek);
        return {
            id: event.event.id, // Assuming `event.event.id` holds the ID
            title: event.event.name || "Untitled Event", // If name is missing, default to "Untitled Event"
            allDay: false,  // Assuming it's not an all-day event
            description: event.event.description, // Event description
            eventCode: event.event.code, // Event code
            backgroundColor: event.eventRegistrant.backgroundColor, // Color for the event background
            borderColor: event.eventRegistrant.borderColor, // Border color for the event
            color: event.eventRegistrant.textColor, // Text color for the event
            start: startTime,  // Format start time for calendar
            end: endTime,  // Format end time for calendar
        };
    });

    // const formattedEvents = events.map(event => {
    //     const startISO = convertDateToISO(event.startDate); // Convert start date
    //     const endISO = convertDateToISO(event.endDate); // Convert end date

    //     // Create Date objects
    //     const startDate = new Date(startISO);
    //     const endDate = new Date(endISO);


    //     return {
    //         id: event.id,
    //         title: event.name || "Untitled Event",
    //         start: startISO,
    //         end: endDate.toISOString(), // Ensure end date is in ISO format
    //         allDay: false, // Mark as all-day
    //         description: event.description,
    //         eventCode: event.eventCode,
    //         backgroundColor: event.backgroundColor, // Random background color
    //         borderColor: event.borderColor,     // Random border color
    //         color: event.textColor, // Text color (white for readability)
    //         type: "event",
            
    //     };
    // });
    
    // console.log("Formatted Events for Calendar:", formattedEvents);

    // console.log(bookings);

    // const formattedEvents = events.map(event => {
    //     // Parse the booking.date which is already in Singapore time
    //     const startTimeDate = new Date(event.date);
    //     startTimeDate.setMinutes(startTimeDate.getMinutes() + event.startTime); // Apply start time offset
        
    //     const endTimeDate = new Date(event.date);
    //     endTimeDate.setMinutes(endTimeDate.getMinutes() + event.endTime); // Apply end time offset
    
    //     // Format the dates as local Singapore time strings
    //     const formatDate = (date: Date) => {
    //         const year = date.getFullYear();
    //         const month = String(date.getMonth() + 1).padStart(2, '0');
    //         const day = String(date.getDate()).padStart(2, '0');
    //         const hours = String(date.getHours()).padStart(2, '0');
    //         const minutes = String(date.getMinutes()).padStart(2, '0');
    //         return `${year}-${month}-${day}T${hours}:${minutes}:00`; // ISO 8601 format
    //     };
    
    //     const startTimeLocal = formatDate(startTimeDate);  // Local SGT start time
    //     const endTimeLocal = formatDate(endTimeDate);      // Local SGT end time

    //     return {
    //         id: event.id,
    //         title: event.name,
    //         start: startTimeLocal, // Use local Singapore time
    //         end: endTimeLocal,     // Use local Singapore time
    //         allDay: false,
    //         category: "time",
    //         description: event.description,
    //         participant: null,
    //         eventCode: event.eventCode,
    //         reminder: null,
    //         reminderDate: null,
    //         startTime: event.startTime,
    //         endTime: event.endTime,
    //         backgroundColor: event.backgroundColor, // Random background color
    //         borderColor: event.borderColor,     // Random border color
    //         color: event.textColor, // Text color (white for readability)
    //         type: "booking",
    //     };
    // });
    
    // console.log("Formatted Bookings:", formattedBookings);

    // const allCalendarEntries = [...formattedEvents];

    console.log(formattedEvents);


    useEffect(() => {
        setIsClient(true); // Ensures component renders only on client side
    }, []);

    const calendarProps: typeof Props = {
        height: '600px', // Adjust as needed
        view: 'week', // Set default view as 'week'
        events: formattedEvents,
        week: {
            hourStart: 0,
            hourEnd: 24,
            startDayOfWeek: new Date().getDay(),
            taskView: false,
            eventView: ['time'],
        },
        timezone: {
            zones: [
                {
                    timezoneName: "Asia/Singapore",
                    displayLabel: "SGT",
                    tooltip: "Singapore Time (UTC+8)"
                },
            ],
        },
    };
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar {...calendarProps}/>
            </CardContent>
        </Card>
    )
}

function calculateEventTimes(baseDate: Date, dayIdx: number) {
    // Calculate the date based on the baseDate and day index
    const eventDate = new Date(baseDate);
    eventDate.setDate(eventDate.getDate() + dayIdx);

    // Set start time to 10:30 AM in Singapore Time (UTC +8)
    const startTime = new Date(eventDate);
    startTime.setHours(10, 30, 0, 0); // 10:30 AM

    // Calculate end time by adding 15 minutes
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 15); // 10:45 AM

    // Return start and end times in ISO format
    return {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
    };
}

function convertDateToISO(dateString:string): string{
    //Ensure dateString is not null or undefined
    if(!dateString) {
        console.error(`Invalid date string: ${dateString}`);
        return ""; //handle invalid date
    }
    //convert date string from database to Date object
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error(`Invalid date string: ${dateString}`);
        return ""; // Handle invalid date
    }

    // Set date time to midnight and adjust for Singapore timezone (UTC+8)
    date.setHours(0, 0, 0, 0); // Ensure it’s set to midnight
    date.setHours(date.getHours() + 8); // Offset to Singapore time  

    return date.toISOString();
}
