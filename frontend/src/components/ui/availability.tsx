"use client"

import { useEffect, useState } from "react";
import { Button } from "./button";
import { availability } from "@/server/db/schema";

interface AvailabilityProps {
    days: number;
    period: number;
    currentAvailability: number[]
    setCurrentAvailability: any;
    eventId: string;
}

export function Availability({ days, period, currentAvailability, setCurrentAvailability, eventId } : AvailabilityProps) {
    const [userAvailability, setUserAvailability] = useState<number[]>();

    useEffect(() => {
        async function getUserAvailabilityForEvent() {
            const res = await fetch("/api/event/availability?" + new URLSearchParams({
                eventId: eventId
            }));
            const availability = await res.json();
            console.log(availability)
        }

        getUserAvailabilityForEvent();
    }, [userAvailability])

    return (
        <>
            <Button>Save</Button>
        </>
    )
}