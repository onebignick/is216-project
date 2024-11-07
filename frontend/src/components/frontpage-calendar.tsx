"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const Calendar = dynamic(() => import('@toast-ui/react-calendar'), { ssr: false });

interface EventPageProps {
    events: any[];
    className?: string;
    bookings: any[];
}

export default function FrontpageCalendar({ events, className , bookings}: EventPageProps){
    console.log(events);
    const formattedEvents = events
    .filter(event => {
        const endISO = convertDateToISO(event.endDate); // Convert end date to ISO format
        const endDate = new Date(endISO);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        return endDate >= new Date(); // Only include events that are not in the past
    })
    .map(event => {
        const startISO = convertDateToISO(event.startDate);
        const endISO = convertDateToISO(event.endDate);
        const startDate = new Date(startISO);
        const endDate = new Date(endISO);
        const isAllDay = true;

        if (isAllDay) {
            console.log(event.name);
            console.log(endDate.getUTCDate());
            endDate.setUTCHours(0, 0, 0, 0);
        }

        return {
            id: event.id,
            title: event.name || "Untitled Event",
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            allDay: isAllDay,
            category: "allday",
            description: event.description,
        };
    });
    console.log("Formatted Events for Calendar:", formattedEvents);

    console.log(bookings);

    const formattedBookings = bookings.map(booking => {
        // Parse the booking.date which is already in Singapore time
        const startTimeDate = new Date(booking.date);
        startTimeDate.setMinutes(startTimeDate.getMinutes() + booking.startTime); // Apply start time offset
        
        const endTimeDate = new Date(booking.date);
        endTimeDate.setMinutes(endTimeDate.getMinutes() + booking.endTime); // Apply end time offset
    
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

        return {
            id: booking.id,
            title: booking.name,
            start: startTimeLocal, // Use local Singapore time
            end: endTimeLocal,     // Use local Singapore time
            allDay: false,
            category: "time",
            description: booking.description,
            participant: null,
            eventCode: booking.eventCode,
            reminder: null,
            reminderDate: null,
            startTime: booking.startTime,
            endTime: booking.endTime,
            // backgroundColor,
            // borderColor,
            // color: textColor,
            type: "booking",
        };
    });
    
    console.log("Formatted Bookings:", formattedBookings);

    const allCalendarEntries = [...formattedEvents, ...formattedBookings];

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensures component renders only on client side
    }, []);
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>This is a test</CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar
                    height="600px"
                    usageStatistics={false}
                    view="week"
                    events={allCalendarEntries}
                    useCreationPopup={true}
                    useDetailPopup={true}
                    week={{
                        hourStart: 0,  // Start of day in 24-hour format
                        hourEnd: 24,   // End of day in 24-hour format
                        startDayOfWeek: new Date().getDay(), //set start day of the week as current day
                        taskView: false,
                        eventView: ['time', 'allday'],
                    }}
                    timezone={{
                        zones: [
                            {
                                timezoneName: "Asia/Singapore",
                                displayLabel: "SGT",
                                tooltip: "Singapore Time (UTC+8)"
    
                            },
                        ],
                    }}
                />
            </CardContent>
        </Card>
    )
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