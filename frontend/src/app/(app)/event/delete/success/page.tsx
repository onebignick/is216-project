"use client"; // Mark this component as a Client Component

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const eventName = searchParams.get('eventName'); // Get event name from query parameters

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-6 rounded text-center">
                <h1 className="text-2xl font-bold">Event Deleted Successfully!</h1>
                {eventName && ( // Check if eventName exists
                    <p className="mt-4">The event <b>"{eventName}"</b> has been removed from your list.</p>
                )}
                <br></br>
                <Button variant="outline" asChild>
                    <Link href="/event">See More at Your Events</Link>
                </Button>
            </div>
        </div>
    );
};

export default SuccessPage;