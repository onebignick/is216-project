"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { title } from 'process';
const Calendar = dynamic(() => import('@toast-ui/react-calendar'), { ssr: false });

interface EventPageProps {
    events: any[];
    bookings: any[]; // Assuming you have a bookings array as well
}

export default function EventPage({ events, bookings }: EventPageProps) {
    const [isClient, setIsClient] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [filteredBookings, setFilteredBookings] = useState(bookings); // Bookings state
    const [eventFilters, setEventFilters] = useState<{ [key: string]: boolean }>({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const activeFilters = Object.keys(eventFilters).filter(key => eventFilters[key]);

        const filteredEvents = events.filter(event => {
            const eventTitle = event.name || "Untitled Event";
            const matchesFilters = activeFilters.length === 0 || activeFilters.includes(`Event: ${eventTitle}`);
            const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  event.description?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilters && matchesSearch;
        });

        const filteredBookings = bookings.filter(booking => {
            const bookingTitle = booking.type === 'organizer' 
                ? `Organizer: ${booking.name || "Untitled Booking"} - ${booking.participantName || "Unnamed Organizer"}`
                : `Attendee: ${booking.name || "Untitled Booking"}`;
            const matchesFilters = activeFilters.length === 0 || activeFilters.includes(`Booking: ${bookingTitle}`);
            const matchesSearch = booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  booking.participantName?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilters && matchesSearch;
        });

        setFilteredEvents(filteredEvents);
        setFilteredBookings(filteredBookings);
    }, [eventFilters, searchTerm, events, bookings]);

    return (
        <div className="p-4 flex flex-col lg:flex-row gap-4">
            {isClient ? (
                <>
                    <EventPageSidebar 
                        events={events} 
                        bookings={bookings}
                        setEventFilters={setEventFilters} 
                        eventFilters={eventFilters} 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                    />
                    <MainEventPage 
                        events={filteredEvents} 
                        bookings={filteredBookings}
                    />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

// type EventFilters = {
//     event1: boolean;
//     event2: boolean;
//     event3: boolean;
// };

// Sidebar Component
function EventPageSidebar({ events, bookings, setEventFilters, eventFilters, searchTerm, setSearchTerm }: { 
    events: any[], 
    bookings: any[], 
    setEventFilters: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>, 
    eventFilters: { [key: string]: boolean }, 
    searchTerm: string, 
    setSearchTerm: React.Dispatch<React.SetStateAction<string>> 
}) {
    const formattedEventTitles = events.map(event => `Event: ${event.name || "Untitled Event"}`);
    const formattedBookingTitles = bookings.map((booking) => {
        if (booking.type === 'organizer') {
            return `Booking: Organizer: ${booking.name || "Untitled Booking"} - ${booking.participantName || "Unnamed Organizer"}`;
        }
        return `Booking: Attendee: ${booking.name || "Untitled Booking"}`;
    });

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setEventFilters((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    return (
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-6 mb-4 lg:mb-0">
            <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">My Organizers & Attendee Meetings</h2>
            <Input 
                placeholder="Search Meetings" 
                className="mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <h3 className="font-bold text-md mb-2 hidden lg:block">Filter Organizer Meetings:</h3>
            <div className="space-y-2 hidden lg:block">
                {formattedEventTitles.map((title, index) => (
                    <label key={index} className="flex items-center">
                        <input
                            type="checkbox"
                            name={title} 
                            checked={eventFilters[title] || false}
                            onChange={handleCheckboxChange}
                            className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
                        />
                        <span className="text-gray-700">{title.replace("Event: ", "")}</span>
                    </label>
                ))}

                <h3 className="font-bold text-md mt-4">Filter My Meetings:</h3>
                {formattedBookingTitles.map((title, index) => (
                    <label key={index} className="flex items-center">
                        <input
                            type="checkbox"
                            name={title} 
                            checked={eventFilters[title] || false}
                            onChange={handleCheckboxChange}
                            className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
                        />
                        <span className="text-gray-700">{title.replace("Booking: ", "")}</span>
                    </label>
                ))}
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


function calculateDaysUntilReminder(reminderDate: string, startDate: Date): number {
    const reminder = new Date(reminderDate);
    const start = new Date(startDate);

    // Calculate the difference in time
    const timeDifference = start.getTime() - reminder.getTime(); // getTime() returns the time value in milliseconds

    // Calculate the difference in days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    // Return daysDifference; if the reminder date is in the past, return 0
    return daysDifference >= 0 ? daysDifference : 0; 
}

function convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60); // Calculate hours
    const remainingMinutes = minutes % 60;  // Calculate remaining minutes

    // Pad single-digit minutes with a leading zero
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

function MainEventPage({ events, bookings }: { events: any[], bookings: any[]  }) {
    
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(events, bookings);
    
    const formattedEvents = events.map(event => {
        const startISO = convertDateToISO(event.startDate); // Convert start date
        const endISO = convertDateToISO(event.endDate); // Convert end date

        // Create Date objects
        const startDate = new Date(startISO);
        const endDate = new Date(endISO);

        const daysUntilReminder = calculateDaysUntilReminder(event.reminder, startDate);

        // Automatically set allDay to true
        const isAllDay = true;

        // Adjust the end date for all-day events
        if (isAllDay) {
            // Set end date to startDate + 1 day for all-day events
            endDate.setUTCDate(endDate.getUTCDate()); // Move end date to the next day
            endDate.setUTCHours(0, 0, 0, 0); // Reset time to start of the day
        }
        
        const reminderDate = formatDateToDDMMYYYY(new Date(event.reminder));;

        const startTime = convertMinutesToTime(event.startTime);
        const endTime = convertMinutesToTime(event.endTime);

        return {
            id: event.id,
            title: event.name || "Untitled Event",
            start: startISO,
            end: endDate.toISOString(), // Ensure end date is in ISO format
            allDay: isAllDay, // Mark as all-day
            category: "allday",
            description: event.description,
            participant: event.participantNum,
            eventCode: event.eventCode,
            reminder: daysUntilReminder,
            reminderDate: reminderDate.toLocaleString(),
            startTime: startTime,
            endTime: endTime,
            backgroundColor: event.backgroundColor, // Random background color
            borderColor: event.borderColor,     // Random border color
            color: event.textColor, // Text color (white for readability)
            type: "event",
            
        };
    });
    console.log("Formatted Events", formattedEvents);

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
    
         // Generate title based on booking type and name, assuming 'booking' object has the necessary properties
        const title = booking.type === 'organizer' 
        ? `Meeting with ${booking.participantName || "Unnamed Organizer"}`
        : `Attendee: ${booking.name || "Untitled Booking"}`;

        return {
            id: booking.id,
            title: title, // Fallback if no matching booking found,
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
            backgroundColor: booking.backgroundColor, // Random background color
            borderColor: booking.borderColor,     // Random border color
            color: booking.textColor, // Text color (white for readability)
            type: "booking",
        };
    });
    
    console.log("Formatted Bookings:", formattedBookings);    
    
    // Combine events and bookings for the calendar
    const allCalendarEntries = [...formattedEvents, ...formattedBookings];

    const handleEventClick = (event: any) => {
        const clickedEvent = event.event; // Access the nested 'event' object
        console.log("Original Event Data:", clickedEvent);

        // Find the matching event in formattedEvents using ID to get the description
        const matchedEvent = formattedEvents.find(e => e.id === clickedEvent.id);
        const matchedBooking = formattedBookings.find(e => e.id ===  clickedEvent.id);
        console.log(matchedBooking);
        const matchedEventtype = matchedEvent ? matchedEvent.type : "No type available";
        const matchedBookingtype = matchedBooking ? matchedBooking.type : "No type available";

        const zoomLink = "https://smu-sg.zoom.us/j/96930333437?pwd=CeObmi1R8m1pICDs8faWPzEzngjGmD.1"; //replace with API
        
        if (matchedEvent) {
            console.log(matchedEventtype);
            const description = matchedEvent ? matchedEvent.description : "No description available";
            const participant = matchedEvent ? matchedEvent.participant: "No participant available";
            const eventCode = matchedEvent ? matchedEvent.eventCode: "No event Code available";
            const reminder = matchedEvent ? matchedEvent.reminder: "No reminder available";
            const reminderDate = matchedEvent ? matchedEvent.reminderDate: "No reminder available";
            const startTime =  matchedEvent ? matchedEvent.startTime: "No Start Time available";
            const endTime =  matchedEvent ? matchedEvent.endTime: "No End Time available";

            // Map the `clickedEvent` data to the simpler structure
            const formattedEvent = {
                id: clickedEvent.id,
                title: clickedEvent.title,
                start: clickedEvent.start.d.d, // Accessing the date string
                end: clickedEvent.end.d.d, // Accessing the date string
                allDay: clickedEvent.isAllday || false, // Important for showing as all-day
                description: description, // Fallback to description
                eventCode: eventCode,
                participant: participant,
                startTime: startTime,
                endTime: endTime,
                reminder: reminder,
                reminderDate: reminderDate,
                type: matchedEventtype,
                zoomLink: zoomLink
            };

            setSelectedEvent({
                id: formattedEvent.id,
                title: formattedEvent.title,
                start: new Date(formattedEvent.start).toLocaleString(),
                end: new Date(formattedEvent.end).toLocaleString(),
                description: formattedEvent.description,
                participant: formattedEvent.participant,
                eventCode: formattedEvent.eventCode,
                reminder: formattedEvent.reminder,
                reminderDate: formattedEvent.reminderDate,
                startTime: formattedEvent.startTime,
                endTime: formattedEvent.endTime,
                type: matchedEventtype,
                zoomLink: zoomLink
            });

            console.log("Formatted Clicked Event Data:", formattedEvent);

        } 
        
        if (matchedBooking){
            console.log(matchedBookingtype);
            const description = matchedBooking ? matchedBooking.description : "No description available";
            const startTime =  matchedBooking ? matchedBooking.startTime: "No Start Time available";
            const endTime = matchedBooking ? matchedBooking.endTime: "No End Time available";
            const zoomLink = "https://smu-sg.zoom.us/j/96930333437?pwd=CeObmi1R8m1pICDs8faWPzEzngjGmD.1"; //replace with API

            // Map the `clickedEvent` data to the simpler structure
            const formattedEvent = {
                id: clickedEvent.id,
                title: clickedEvent.title,
                start: clickedEvent.start.d.d, // Accessing the date string
                end: clickedEvent.end.d.d, // Accessing the date string
                allDay: clickedEvent.isAllday || false, // Important for showing as all-day
                description: description, // Fallback to description
                startTime: convertMinutesToTime(startTime),
                endTime:  convertMinutesToTime(endTime),
                type: matchedBookingtype,
                zoomLink: zoomLink
            };

            setSelectedEvent({
                id: formattedEvent.id,
                title: formattedEvent.title,
                start: new Date(formattedEvent.start).toLocaleString(),
                end: new Date(formattedEvent.end).toLocaleString(),
                description: formattedEvent.description,
                startTime: formattedEvent.startTime,
                endTime: formattedEvent.endTime,
                type: matchedBookingtype,
                zoomLink: zoomLink
            });
            
            console.log("Formatted Clicked Book Event Data:", formattedEvent);
        }
    
        setIsModalOpen(true);
    };
        
    return (

        <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Calendar (Current Month)</h2>
            <p className="mb-4">Your Monthly Meetings Events</p>
            <Calendar 
                height="700px" 
                events={allCalendarEntries} 
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

const EventDetailModal = ({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: any }) => {
    console.log("Modal Event:", event); // Log the event in the modal
    
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal

    const router = useRouter(); // Initialize useRouter

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

    // Handle delete function
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/Bookevent/delete/${event.id}`, {
                method: "DELETE",
            });
    
            const response = await res.json();
    
            if (response.message === "Book Event deleted successfully") {
                setSuccessMessage("Book Event deleted successfully!");
                setShowDeleteModal(false); // Close the confirmation modal
                router.push(`/event/delete/success?eventName=${event.title}`);
            } else {
                setErrorMessage(response.message || "Failed to delete event.");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            setErrorMessage("An error occurred while deleting the event.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <div className="flex justify-between items-center mb-4">
                    {event.type === 'event' && (
                        <h2 className="text-xl font-bold text-center flex-grow">Event Name: {event.title}</h2>
                    )}

                    {event.type === 'booking' && (
                        <h2 className="text-xl font-bold text-center flex-grow">{event.title}</h2>
                    )}
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        &times;
                    </button>
                </div>

                {/* Event details */}
                {event.type === 'event' && (
                    <>
                        <p>Event Code: {event.eventCode}</p>
                        <p>Event Duration: {formatDateToDDMMYYYY(startDate)} - {formatDateToDDMMYYYY(endDate)}</p>
                        <p>Event Timing: {event.startTime} - {event.endTime}</p>
                        <p>Reminder Participant Date: {event.reminderDate} ({event.reminder - 1} days)</p>
                        <p>Total Participant Number: {event.participant}</p>
                        <p>Description: {event.description}</p>
                        <p>Zoom Link: <Link href={event.zoomLink} className='underline decoration text-blue-500'>Link</Link></p>
                        <br />
                        <Button className="mb-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-md">
                            <Link href={`/event/${event.id}`}>View More Details</Link>
                        </Button>
                    </>
                )}

                {/* Booking event details */}
                {event.type === 'booking' && (
                    <>
                        <p>Starts Date: {formatDateToDDMMYYYY(startDate)}</p>
                        <p>Start Time: {event.startTime}</p>
                        <p>End Time: {event.endTime}</p>
                        <p>Description: {event.description}</p>
                        <p>Zoom Link: {event.zoomLink}</p>
                        <br />
                        <div className="flex justify-between gap-2">
                            <Button 
                                className="w-1/2 bg-blue-600 text-white hover:bg-gray-600 rounded-md">
                                Update Timeslot
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => setShowDeleteModal(true)} 
                                className="w-1/2 bg-red-600 text-white hover:bg-gray-600 rounded-md">
                                Cancel Timeslot
                            </Button>
                        </div>
                    </>
                )}

                {/* Delete confirmation modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 w-1/3">
                            <h3 className="text-xl mb-4 text-center">Are you sure you want to cancel this timing?</h3>
                            {successMessage && <p className="text-green-500">{successMessage}</p>}
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                            <div className="flex justify-between gap-2">
                                <Button 
                                    onClick={() => setShowDeleteModal(false)} 
                                    className="w-1/2 bg-gray-500 text-white hover:bg-gray-600 rounded-md">
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleDelete} 
                                    className="w-1/2 bg-red-500 text-white hover:bg-red-600 rounded-md">
                                    Confirm Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};