"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Props from '@toast-ui/react-calendar';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Calendar = dynamic(() => import('@toast-ui/react-calendar'), { ssr: false });

interface EventPageProps {
    events: any[];
    className?: string;
}
// ../../node_modules/@toast-ui/react-calendar/types/index.d.ts
export default function FrontpageCalendar({ events, className}: EventPageProps){
    const [isClient, setIsClient] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // console.log(events);

    const startOfWeek = new Date(); 
    
    const formattedEvents = events
    .map(event => {

        const timeslot = event.eventRegistrant.timeslotIdx;
        const dayIdx =  event.eventRegistrant.dayIdx;
        const zoomLink = event.eventRegistrant.zoomLink;

        const meetingPeriod = event.event.meetingPeriod;
        const {start, end} = convertTimeslotIdxToMinutes(timeslot, meetingPeriod);

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
            participantEmail: event.eventRegistrant.participantEmail,
            zoomLink: zoomLink
        };
    });


    // console.log(formattedEvents);

    const handleEventClick = (event: any) => {
        const clickedEvent = event.event; // Access the nested 'event' object
        // console.log("Original Event Data:", clickedEvent);

        // Find the matching event in formattedEvents using ID to get the description
        const matchedEvent = formattedEvents.find(e => e.id === clickedEvent.id);
        
        const zoomLink = matchedEvent ? matchedEvent.zoomLink: "No zoom link available";

        const description = matchedEvent ? matchedEvent.description : "No description available";
        const eventCode = matchedEvent ? matchedEvent.eventCode: "No event Code available";
        const startTime =  matchedEvent ? matchedEvent.start: "No Start Time available";
        const endTime =  matchedEvent ? matchedEvent.end: "No End Time available";
        const participantEmail =  matchedEvent ? matchedEvent.participantEmail: "No participant Email available";

        // Map the `clickedEvent` data to the simpler structure
        const formattedEvent = {
            id: clickedEvent.id,
            title: clickedEvent.title,
            start: clickedEvent.start.d.d, // Accessing the date string
            end: clickedEvent.end.d.d, // Accessing the date string
            allDay: clickedEvent.isAllday || false, // Important for showing as all-day
            description: description, // Fallback to description
            eventCode: eventCode,
            startTime: startTime,
            endTime: endTime,
            participantEmail: participantEmail,
            zoomLink: zoomLink
        };

        setSelectedEvent({
            id: formattedEvent.id,
            title: formattedEvent.title,
            start: new Date(formattedEvent.start).toLocaleString(),
            end: new Date(formattedEvent.end).toLocaleString(),
            description: formattedEvent.description,
            eventCode: formattedEvent.eventCode,
            startTime: formattedEvent.startTime,
            endTime: formattedEvent.endTime,
            participantEmail: formattedEvent.participantEmail,
            zoomLink: formattedEvent.zoomLink
        });

        // console.log("Formatted Clicked Event Data:", formattedEvent);
        setIsModalOpen(true);
    } 
        
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
                <CardTitle>Upcoming Meetings</CardTitle>
                    <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar {...calendarProps} onClickEvent={handleEventClick}/>
                {/* Render the modal with event details */}
                <EventDetailModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    event={selectedEvent}  
                />
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

function formatTimeToHHMM(dateStr: string) {
    const date = new Date(dateStr);

    const hours = date.getHours(); // Get the hours from the date
    const minutes = date.getMinutes(); // Get the minutes from the date

    // Format as hh:mm, padding with 0 if necessary
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const EventDetailModal = ({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: any }) => {
    // console.log("Modal Event:", event); // Log the event in the modal
    
    // Ensure the event exists and is not null or undefined
    if (!isOpen || !event) {
        return null;
    }

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    // Check for missing event properties before accessing them
    if (!event.start || !event.end) {
        console.error("Event data is incomplete: ", event);
        return null; // Optionally, display an error message to the user
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full sm:w-4/5 md:w-1/2 lg:w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-center flex-grow">{event.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        &times;
                    </button>
                    
                </div>
                <p>Event Code: {event.eventCode}</p>
                <p>Event Timing: {formatTimeToHHMM(event.startTime)} - {formatTimeToHHMM(event.endTime)} </p>
                <p>Description: {event.description}</p>
                <p>Participant Email: {event.participantEmail}</p>
                <p>Zoom Link: <Link href={event.zoomLink} className='text-blue-600 hover:underline'>Link</Link></p>
                <br />
                <Button className="mb-4 w-full bg-coral text-black hover:bg-coral/70 transition duration-200 rounded-md">
                    <Link href={`/event/${event.id}`}>View More Details</Link>
                </Button>
            </div>
        </div>
    );
};



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
