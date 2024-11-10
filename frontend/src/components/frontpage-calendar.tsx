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

    const startOfWeek = new Date(); 
    
    const formattedEvents = events
    .map(event => {

        const timeslot = event.eventRegistrant.timeslotIdx;
        const dayIdx =  event.eventRegistrant.dayIdx;
        console.log(dayIdx);
        const meetingPeriod = event.event.meetingPeriod;
        const {start, end} = convertTimeslotIdxToMinutes(timeslot, meetingPeriod);

        console.log(start, end);

        // Parse the booking.date which is already in Singapore time
        const startTimeDate = new Date(event.event.startDate);
        startTimeDate.setDate(startTimeDate.getDate() + dayIdx);
        startTimeDate.setMinutes(startTimeDate.getMinutes() + start); // Apply start time offset
               
        const endTimeDate = new Date(event.event.startDate);
        endTimeDate.setDate(endTimeDate.getDate() + dayIdx);
        endTimeDate.setMinutes(endTimeDate.getMinutes() + end); // Apply end time offset
           
        // Format the dates as local Singapore time strings
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:00`; // ISO 8601 format
        };
           
        const startTimeLocal = formatDate(startTimeDate);  // Local SGT start time
        const endTimeLocal = formatDate(endTimeDate);      // Local SGT end time

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
            start: startTimeLocal,  // Format start time for calendar
            end: endTimeLocal,  // Format end time for calendar
        };
    });


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

function convertTimeslotIdxToMinutes(timeslotIdx: number, meetingPeriod: number): { start: number, end: number } {
    // Each timeslot represents a 15-minute increment, so the total minutes is timeslotIdx * 15
    const totalMinutes = timeslotIdx * 15;
    
    // Start time in minutes
    const startMinutes = totalMinutes;
    
    // End time is 15 minutes after the start time
    const endMinutes = totalMinutes + meetingPeriod;
    
    return {
        start: startMinutes,
        end: endMinutes
    };
}


// function convertTimeslotIdxToTime(timeslotIdx: number): string {
//     // Each timeslot represents a 15-minute increment
//     const totalMinutes = timeslotIdx * 15;
  
//     // Calculate hours and minutes from totalMinutes
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;
  
//     // Format hours and minutes as two-digit strings
//     const formattedHours = hours.toString().padStart(2, '0');
//     const formattedMinutes = minutes.toString().padStart(2, '0');
  
//     // Return the time in HH:MM format
//     return `${formattedHours}:${formattedMinutes}`;
// }

// function convertDateToISO(dateString:string): string{
//     //Ensure dateString is not null or undefined
//     if(!dateString) {
//         console.error(`Invalid date string: ${dateString}`);
//         return ""; //handle invalid date
//     }
//     //convert date string from database to Date object
//     const date = new Date(dateString);

//     if (isNaN(date.getTime())) {
//         console.error(`Invalid date string: ${dateString}`);
//         return ""; // Handle invalid date
//     }

//     // Set date time to midnight and adjust for Singapore timezone (UTC+8)
//     date.setHours(0, 0, 0, 0); // Ensure it’s set to midnight
//     date.setHours(date.getHours() + 8); // Offset to Singapore time  

//     return date.toISOString();
// }
