"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

const Calendar = dynamic(() => import("@toast-ui/react-calendar"), { ssr: false });

export default function Event() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set to true when component mounts (client-side)
    }, []);

    return (
        <div className="p-4 flex gap-4">
            {isClient ? (
                <>
                    <EventPageSidebar />
                    <MainEventPage />
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

function EventPageSidebar() {
    const [eventFilters, setEventFilters] = useState<EventFilters>({
        event1: false,
        event2: false,
        event3: false,
    });

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
                {["event 1", "event 2", "event 3"].map((event) => (
                    <label key={event} className="flex items-center">
                        <input
                            type="checkbox"
                            name={event}
                            checked={eventFilters[event as keyof EventFilters]} // Type assertion here
                            onChange={handleCheckboxChange}
                            className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
                        />
                        <span className="text-gray-700">{event.charAt(0).toUpperCase() + event.slice(1).replace('event', 'Event ')}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

function MainEventPage() {
    return (
        <div className="w-2/3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Calendar (Current Month)</h2>
            <p className="mb-4">This will be the main event page</p>
            <Calendar />
        </div>
    );
}
