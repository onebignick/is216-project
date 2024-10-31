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

const ViewNotePage = ({ events }: { events: Event[] }) => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [eventFilters, setEventFilters] = useState<EventFilters>({ event1: false, event2: false, event3: false });
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (eventFilters.event1 && event.name.includes("Event 1")) return true;
        if (eventFilters.event2 && event.name.includes("Event 2")) return true;
        if (eventFilters.event3 && event.name.includes("Event 3")) return true;
        return false;
    }) || [];

    return (
        <div className="relative p-6">
            {/* Go Back Button */}
            <Button variant="outline" className="absolute top-6 left-6">
                <Link href="/event/notes">Go Back</Link>
            </Button>
            <div className="flex flex-wrap gap-6 mt-16">
                {/* My Events Card */}
                <Card className="flex-1 w-1/3 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Person</h2>
                    <Input placeholder="Search Person" className="mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <Button type="submit" className="mb-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-md">
                        Search
                    </Button>

                    <h3 className="font-bold text-md mb-2">Filter person:</h3>
                    <div className="space-y-2">
                        {["event1", "event2", "event3"].map((event) => (
                            <label key={event} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={event}
                                    checked={eventFilters[event as keyof EventFilters]}
                                    onChange={handleCheckboxChange}
                                    className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
                                />
                                <span className="text-gray-700">{`Event ${event.charAt(5)}`}</span>
                            </label>
                        ))}
                    </div>
                </Card>

                {/* Event Details Card */}
                <Card className="flex-2 w-2/3 bg-white shadow-lg rounded-lg p-4">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Event 3 Details</CardTitle>
                        <CardDescription className="text-gray-500">Event description</CardDescription>
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
                <p>Starts at: {formatDateToDDMMYYYY(startDate)}</p>
                <p>Ends at: {formatDateToDDMMYYYY(endDate)}</p>
                <p>Description: {event.description}</p>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};
