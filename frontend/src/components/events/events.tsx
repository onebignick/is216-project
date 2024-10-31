"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

const Calendar = dynamic(() => import('@toast-ui/react-calendar'), { ssr: false });

interface EventPageProps {
    events: any[];
}

export default function EventPage({ events }: EventPageProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensures component renders only on client side
    }, []);

    return (
        <div className="p-4 flex gap-4">
            {isClient ? (
                <>
                    <EventPageSidebar events={events}/>
                    <MainEventPage events={events} />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
type EventFilters = {
    event1: boolean;
    event2: boolean;
    event3: boolean;
};

function EventPageSidebar({ events }: { events: any[] }) {
    const [eventFilters, setEventFilters] = useState<{[key:string]:boolean}>({});

    const formattedEventTitles = events.map(event => {
        return event.name || "Untitled Event"; // Return only the title of the event
    });
    
    // Now you can use `formattedEventTitles` as needed
    console.log("Event Titles:", formattedEventTitles);
    
    

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target as HTMLInputElement;
        setEventFilters((prev) => ({
            ...prev,
            [name]: checked,
        }));
        console.log(`Checkbox ${name} changed to ${checked}`);
    };

    return (
        <div className="w-1/3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">My Events</h2>
            <Input placeholder="Search Events" className="mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
            <Button type="submit" className="mb-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-md">
                Search
            </Button>

            <h3 className="font-bold text-md mb-2">Filter Events:</h3>
            <div className="space-y-2">
            {formattedEventTitles.length > 0 ? (
                    formattedEventTitles.map((title, index) => (
                        <label key={index} className="flex items-center">
                            <input
                                type="checkbox"
                                name={title} // Use the event title as the checkbox name
                                checked={eventFilters[title] || false} // Default to false if not defined
                                onChange={handleCheckboxChange}
                                className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
                            />
                            <span className="text-gray-700">{title}</span>
                        </label>
                    ))
                ) : (
                    <p>No events available</p> // Fallback message
                )}
            </div>
        </div>
    );
}

function convertDateToISO(dateString: string): string {
    // Ensure dateString is not null or undefined
    if (!dateString) {
        console.error(`Invalid date string: ${dateString}`);
        return ""; // Handle invalid date
    }

    // Convert date string from database to Date object
    const date = new Date(dateString);
    
    // Check for valid date
    if (isNaN(date.getTime())) {
        console.error(`Invalid date string: ${dateString}`);
        return ""; // Handle invalid date
    }

    // Set date time to midnight and adjust for Singapore timezone (UTC+8)
    date.setHours(0, 0, 0, 0); // Ensure it’s set to midnight
    date.setHours(date.getHours() + 8); // Offset to Singapore time   
    
    // Return ISO format in UTC
    return date.toISOString();
}

function MainEventPage({ events }: { events: any[] }) {

    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log(events);
    const formattedEvents = events.map(event => {
        const startISO = convertDateToISO(event.startDate); // Convert start date
        const endISO = convertDateToISO(event.endDate); // Convert end date

        // Create Date objects
        const startDate = new Date(startISO);
        const endDate = new Date(endISO);

        // Automatically set allDay to true
        const isAllDay = true;

        // Adjust the end date for all-day events
        if (isAllDay) {
            // Set end date to startDate + 1 day for all-day events
            endDate.setUTCDate(endDate.getUTCDate()); // Move end date to the next day
            endDate.setUTCHours(0, 0, 0, 0); // Reset time to start of the day
        }

        return {
            id: event.id,
            title: event.name || "Untitled Event",
            start: startISO,
            end: endDate.toISOString(), // Ensure end date is in ISO format
            allDay: isAllDay, // Mark as all-day
            category: "allday",
            description: event.description
        };
    });

    console.log("Formatted Events for Calendar:", formattedEvents);
    
    const handleEventClick = (event: any) => {
        const clickedEvent = event.event; // Access the nested 'event' object
        console.log("Original Event Data:", clickedEvent);

        // Find the matching event in formattedEvents using ID to get the description
        const matchedEvent = formattedEvents.find(e => e.id === clickedEvent.id);
        const description = matchedEvent ? matchedEvent.description : "No description available";

        // Map the `clickedEvent` data to the simpler structure
        const formattedEvent = {
            id: clickedEvent.id,
            title: clickedEvent.title,
            start: clickedEvent.start.d.d, // Accessing the date string
            end: clickedEvent.end.d.d, // Accessing the date string
            allDay: clickedEvent.isAllday || false, // Important for showing as all-day
            description: description, // Fallback to description
        };
    
        console.log("Formatted Clicked Event Data:", formattedEvent);
    
        setSelectedEvent({
            title: formattedEvent.title,
            start: new Date(formattedEvent.start).toLocaleString(),
            end: new Date(formattedEvent.end).toLocaleString(),
            description: formattedEvent.description,
        });
    
        setIsModalOpen(true);
    };
    
    return (

        <div className="w-2/3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Calendar (Current Month)</h2>
            <p className="mb-4">This will be the main event page</p>
            <Calendar 
                height="700px" 
                events={formattedEvents}
                usageStatistics={false}
                view="month" 
                week={{
                    hourStart: 0,  // Start of day in 24-hour format
                    hourEnd: 24,   // End of day in 24-hour format
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
                onClickEvent={handleEventClick} // Attach the click handler
            />
            {/* Render the modal with event details */}
            <EventDetailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                event={selectedEvent} 
            />
        </div>
        
    );
}

function formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1) and pad
    const year = date.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Return formatted date
}

// Modal Component
const EventDetailModal = ({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: any; }) => {
    console.log("Modal Event:", event); // Log the event in the modal
    if (!isOpen || !event) return null;

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-center flex-grow">{event.title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-800"
                    >
                        &times;
                    </button>
                </div>
                <p>Starts at: {formatDateToDDMMYYYY(startDate)}</p>
                <p>Ends at: {formatDateToDDMMYYYY(endDate)}</p>
                <p>Description: {event.description}</p>
                <button 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

