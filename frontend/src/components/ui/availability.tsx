"use client"

import { useEffect, useState } from "react";
import { Button } from "./button";
import { MeetgridEvent } from "@/server/entity/event";

interface AvailabilityProps {
    days: number;
    period: number;
    currentAvailability: number[]
    setCurrentAvailability: any;
    eventInformation: MeetgridEvent;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function Availability({ days, period, currentAvailability, setCurrentAvailability, eventInformation } : AvailabilityProps) {
    const [userAvailability, setUserAvailability] = useState<number[]>();

    useEffect(() => {
        async function handleUserAvailability() {
            const res = await fetch("/api/event/availability?" + new URLSearchParams({
                eventId: eventInformation.id!
            }));
            const { result } = await res.json();

            let newUserAvailability: number[];
            if (result.length === 0) {
                newUserAvailability = Array(672).fill(0);
            } else {
                newUserAvailability = result[0].split(",").map((str: string) => parseInt(str))
            }
            setUserAvailability(newUserAvailability);
            console.log(newUserAvailability)
        }

        handleUserAvailability();
    }, [])

    function generateTableHeaders() {
        const headers = [];
        for(let i=0;i<DAYS_OF_WEEK.length;i++) {
            headers.push(<TableHeader key={i} day={DAYS_OF_WEEK[i]}/>)
        }
        return headers
    }

    function generateTableBody() {

    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {generateTableHeaders()}
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
            <Button>Save</Button>
        </>
    )
}

function TableHeader({day} : {day: string}) {
    return <th>{day}</th>
}