"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const Calendar = dynamic(() => import('@toast-ui/react-calendar'), { ssr: false });

interface EventPageProps {
    events: any[];
    className?: string;
}

export default function FrontpageCalendar({ events, className }: EventPageProps){
    console.log(events);
    const formattedEvents = events
    .filter(event => {
        const endISO = convertDateToISO(event.endDate); // Convert end date to ISO format
        const endDate = new Date(endISO);
        return endDate > new Date(); // Only include events that are not in the past
    })
    .map(event => {
        const startISO = convertDateToISO(event.startDate);
        const endISO = convertDateToISO(event.endDate);
        const startDate = new Date(startISO);
        const endDate = new Date(endISO);
        const isAllDay = true;

        if (isAllDay) {
            endDate.setUTCDate(endDate.getUTCDate() + 1);
            endDate.setUTCHours(0, 0, 0, 0);
        }

        return {
            id: event.id,
            title: event.name || "Untitled Event",
            start: startISO,
            end: endDate.toISOString(),
            allDay: isAllDay,
            category: "allday",
            description: event.description,
        };
    });
    console.log("Formatted Events for Calendar:", formattedEvents);

    
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
                    events={formattedEvents}
                    useCreationPopup={true}
                    useDetailPopup={true}
                    week={{
                        hourStart: 0,  // Start of day in 24-hour format
                        hourEnd: 24,   // End of day in 24-hour format
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