"use client"

import { MeetgridEvent } from "@/server/entity/event";
import { useEffect, useState } from "react";

interface AvailabilityProps {
    period: number;
    eventInformation: MeetgridEvent;
}

export function GroupAvailability({ eventInformation } : AvailabilityProps) {
    const [availability, setAvailability] = useState<number[]>([]);

    const startDate = new Date(eventInformation.startDate!);
    const startDateOffset = startDate.getDay();
    const endDate = new Date(eventInformation.endDate!);
    const offset = startDate.getDay() + 6 - endDate.getDay();
    const diff = (endDate-startDate) / (1000 * 60 * 60 * 24);

    useEffect(() => {
        async function getEventAvailability() {
            const res = await fetch("/api/event?" + new URLSearchParams({
                eventId: eventInformation.id!
            }))

            const response = await res.json();
            setAvailability(response.result)
        }
        getEventAvailability();
    }, [])

    
    function generateTableHeaders() {
        const headers = [];
        const curDate = startDate;
        const options = { weekday: "short", day: "2-digit", month: "short" }
        
        curDate.setDate(curDate.getDate());
        for (let i=0; i <= diff; i++) {
            headers.push(<TableHeader title={curDate.toLocaleDateString("en-GB", options)}/>)
            curDate.setDate(curDate.getDate() + 1)
        }

        return headers;
    }

    function generateTableBody() {
        const fifteenMinIntervalInDay = 1440 / 15;
        const interval = availability.length * 15 / 1440
        const body = Array.from({ length: fifteenMinIntervalInDay }, () => new Array(diff+1).fill(0));

        const result = []
        for (let i=0;i<fifteenMinIntervalInDay;i++) {
            for (let j=0;j<=diff; j++) {
                if (availability![fifteenMinIntervalInDay*j + i] != 0) {
                    body[i][j] = availability![fifteenMinIntervalInDay*j + i]
                }
            }
        }
        result.push(<TableRow table={body}/>)

        return result;
    }

    return (
        <>
            <table className="border border-collapse border-slate-500">
                <thead>
                    <tr>
                        {generateTableHeaders()}
                    </tr>
                </thead>
                <tbody>
                    {generateTableBody()}
                </tbody>
            </table>
        </>
    )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500">{title}</th>
}

function TableRow({ table }: { table: number[][] }) {
    return (
        <>
            {table.map(( row, idy ) => {
                return (
                    <tr key={idy}>
                        {
                            row.map(( col, idx ) => {
                                if (table[idy][idx] === 0) return <td key={idx} className="h-[10px] w-[30px] border border-slate-500"></td>
                                else return <td key={idx} className="h-[10px] w-[30px] bg-green-800 border border-slate-500"></td>
                            })
                        }
                    </tr>
                )
            })}
        </>
    )
}