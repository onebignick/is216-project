"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type EventFilters = {
    event1: boolean;
    event2: boolean;
    event3: boolean;
    event4: boolean; // Added event4
    event5: boolean; // Added event5
    event6: boolean; // Added event6
};

interface Event {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    questions: { [key: string]: string }; // Dynamic questions
}

const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const ViewNotePage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [eventFilters, setEventFilters] = useState<EventFilters>({ event1: false, event2: false, event3: false, event4: false, event5:false, event6:false});
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    // Mock event data (replace with actual data fetching)
    const fetchEvents = () => {
        // Replace this with your actual API call or data source
        return [
            {
                id: "1",
                name: "Event 1",
                startDate: "2024-10-30T10:00:00Z",
                endDate: "2024-10-30T12:00:00Z",
                description: "Description for Event 1",
                questions: { question1: "", question2: "" },
            },
            {
                id: "2",
                name: "Event 2",
                startDate: "2024-10-31T10:00:00Z",
                endDate: "2024-10-31T12:00:00Z",
                description: "Description for Event 2",
                questions: { question1: "", question2: "" },
            },
            {
                id: "3",
                name: "Event 3",
                startDate: "2024-10-31T10:00:00Z",
                endDate: "2024-10-31T12:00:00Z",
                description: "Description for Event 3",
                questions: { question1: "", question2: "" },
            },
            {
                id: "4",
                name: "Event 4",
                startDate: "2024-10-31T10:00:00Z",
                endDate: "2024-10-31T12:00:00Z",
                description: "Description for Event 4",
                questions: { question1: "", question2: "" },
            },
            {
                id: "5",
                name: "Event 5",
                startDate: "2024-10-31T10:00:00Z",
                endDate: "2024-10-31T12:00:00Z",
                description: "Description for Event 5",
                questions: { question1: "", question2: "" },
            },
            {
                id: "6",
                name: "Event 6",
                startDate: "2024-10-31T10:00:00Z",
                endDate: "2024-10-31T12:00:00Z",
                description: "Description for Event 6",
                questions: { question1: "", question2: "" },
            },
            // Add more events as needed
        ];
    };

    useEffect(() => {
        const fetchedEvents = fetchEvents();
        setEvents(fetchedEvents);

        // Set selected event based on id from URL
        const event = fetchedEvents.find(event => event.id === id);
        if (event) {
            setSelectedEvent(event);
        }
    }, [id]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setEventFilters((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleEventClick = (event: Event) => {
        setSelectedEvent({
            ...event,
            startDate: new Date(event.startDate).toLocaleString(),
            endDate: new Date(event.endDate).toLocaleString(),
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (id: string, questionKey: string, value: string) => {
        setSelectedEvent((prevEvent) =>
            prevEvent?.id === id
                ? { ...prevEvent, questions: { ...prevEvent.questions, [questionKey]: value } }
                : prevEvent
        );
    };

    const filteredEvents = events?.filter((event) => {
        if (eventFilters.event1 && event.name.includes("Person 1")) return true;
        if (eventFilters.event2 && event.name.includes("Person 2")) return true;
        if (eventFilters.event3 && event.name.includes("Person 3")) return true;
        if (eventFilters.event4 && event.name.includes("Person 4")) return true; // Adjusted for event 4
        if (eventFilters.event5 && event.name.includes("Person 5")) return true; // Adjusted for event 5
        if (eventFilters.event6 && event.name.includes("Person 6")) return true; // Adjusted for event 6
        return false;
    }) || [];

    return (
        <div className="relative p-6 h-screen flex flex-col">
            {/* Go Back Button */}
            <Button variant="outline" className="absolute top-6 left-6 bg-black text-white hover:bg-gray-800 transition duration-200 rounded-md">
                <Link href="/event/notes">Go Back</Link>
            </Button>
            <div className="flex flex-wrap gap-6 mt-16 flex-grow">
                {/* My Events Card */}
                <Card className="flex-1 bg-white shadow-lg rounded-lg p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Person</h2>
                    <Input placeholder="Search" className="mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <Button type="submit" className="mb-4 w-full bg-black text-white hover:bg-gray-800 transition duration-200 rounded-md">
                        Search
                    </Button>

                    <h3 className="font-bold text-md mb-2">Filter person:</h3>
                    <div className="space-y-2">
                    {["event1", "event2", "event3", "event4", "event5", "event6"].map((event) => (
                        <label key={event} className="flex items-center">
                            <input
                                type="checkbox"
                                name={event}
                                checked={eventFilters[event as keyof EventFilters]}
                                onChange={handleCheckboxChange}
                                className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
                            />
                            <span className="text-gray-700">{`Person ${event.charAt(5)}`}</span>
                        </label>
                    ))}
                    </div>
                </Card>

                {/* Event Details Card */}
                <Card className="flex-2 bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-120px)] overflow-y-auto w-3/4">
                    {selectedEvent && (
                        <>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">{selectedEvent.name} Details</CardTitle>
                                <CardDescription className="text-gray-500">{selectedEvent.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table className="mt-4">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Timeslot</TableHead>
                                            <TableHead>Status</TableHead>
                                            {filteredEvents[0]?.questions && Object.keys(filteredEvents[0].questions).map((key) => (
                                                <TableHead key={key}>{key}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEvents.map((event) => (
                                            <TableRow key={event.id} onClick={() => handleEventClick(event)}>
                                                <TableCell>{event.name}</TableCell>
                                                <TableCell>{`${formatDateToDDMMYYYY(new Date(event.startDate))} - ${formatDateToDDMMYYYY(new Date(event.endDate))}`}</TableCell>
                                                <TableCell>Sample Status</TableCell>

                                                {Object.keys(event.questions).map((questionKey) => (
                                                    <TableCell key={questionKey}>
                                                        <input
                                                            type="text"
                                                            value={event.questions[questionKey]}
                                                            onChange={(e) => handleInputChange(event.id, questionKey, e.target.value)}
                                                            className="w-full p-1 border rounded"
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </>
                    )}
                </Card>

                {/* Event Detail Modal */}
                <EventDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={selectedEvent} />
            </div>
        </div>
    );
};

export default ViewNotePage;

// Modal Component
const EventDetailModal = ({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: Event | null }) => {
    if (!isOpen || !event) return null;

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-center flex-grow">{event.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        &times;
                    </button>
                </div>
                <p>Starts: {startDate.toLocaleString()}</p>
                <p>Ends: {endDate.toLocaleString()}</p>
                <p>{event.description}</p>
                <button onClick={onClose} className="mt-4 w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600">
                    Close
                </button>
            </div>
        </div>
    );
};
