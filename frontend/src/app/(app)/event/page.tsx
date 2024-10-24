"use client";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
/* ES6 module in Node.js environment */
const Calendar = dynamic(() => import('@toast-ui/react-calendar'), { ssr: false });
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
    )
}

function EventPageSidebar() {
    return (
        <div className='w-1/3'>
            <Input
                placeholder="Search Events"
            />
            <Button type="submit">
                Search
            </Button>

            This will be the event page sidebar
        </div>
    )
}

function MainEventPage() {
    return (
        
        
        <div className='w-2/3'>
            <h2 style={{ fontWeight: 'bold', fontSize: '2.2rem', marginBottom: '1rem' }}>Calendar (Current Month)
            </h2>
            This will be the main event page
            <Calendar 

            />
        </div>
        
        
    )
}