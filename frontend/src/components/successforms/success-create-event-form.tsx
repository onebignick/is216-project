"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SuccessCreateEventForm() {
    const router = useRouter();
    const [eventCode, setEventCode] = useState('');
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('eventCode'); // Get the event code from the URL
        if (code) {
            setEventCode(code); // Set the event code in state
        }
    }, []);
    
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-6 rounded text-center">
                <div className="flex flex-col items-center text-3xl text-green-500 font-bold ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                
                <h1 className="text-3xl font-bold">You have successfully created an event!</h1>
                <br></br>
                <h1 className="text-2xl">Confirmation Code: {eventCode}</h1> {/* Display the event code */}
                <br></br>
                <h1 className="text-2xl">Your Zoom Link is: </h1>
                <br></br>
                <Button variant="outline" asChild>
                    <Link href="/event">See More at Your Events</Link>
                </Button>
            </div>
        </div>

    );
}
