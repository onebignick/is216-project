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
        <div className="flex justify-center items-center h-full vertical-align:middle">
            <div className="flex flex-col items-center p-2">
                <div className="flex flex-col items-center text-center text-3xl text-green-500 font-bold ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <br />
                    <h1>You have Successfully Created An Event.</h1>
                    <br />
                    <h1>Confirmation Code: {eventCode}</h1> {/* Display the event code */}
                    <br />
                    <h1>Your Zoom Link is: </h1>
                </div>
                <br/>
                <div>
                    <Button variant="outline" asChild>
                        <Link href="/event/notes">See More at Your Events</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
