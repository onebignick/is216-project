"use client"

import { MeetgridEvent } from "@/server/entity/event";
import { useEffect, useState } from "react";

interface AvailabilityProps {
    period: number;
    eventInformation: MeetgridEvent;
}

export function GroupAvailability({ eventInformation } : AvailabilityProps) {
    const [availability, setAvailability] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const startDate = new Date(eventInformation.startDate!);
    const endDate = new Date(eventInformation.endDate!);
    const diff = (+endDate - +startDate) / (1000 * 60 * 60 * 24);

    useEffect(() => {
        async function getEventAvailability() {
            setIsLoading(true); // Set loading state to true before fetching
            const res = await fetch("/api/event?" + new URLSearchParams({
                eventId: eventInformation.id!
            }));

            const response = await res.json();
            setAvailability(response.result);
            setIsLoading(false); // Set loading state to false after data is fetched
        }
        getEventAvailability();
    }, [eventInformation.id]);

      // Generate 15-minute time intervals for each row
      function generateTimeIntervals() {
        const intervals = [];
        for (let i = 0; i < 1440; i += 15) {
            const hours = String(Math.floor(i / 60)).padStart(2, '0');
            const minutes = String(i % 60).padStart(2, '0');
            intervals.push(`${hours}:${minutes}`);
        }
        return intervals;
    }

    function generateTableHeaders() {
        const headers = [<TableHeader title="Time" key="time-header" />];
        const curDate = new Date(startDate);
        const options = { weekday: "short", day: "2-digit", month: "short" };

        for (let i = 0; i <= diff; i++) {
            headers.push(
                <TableHeader
                    title={curDate.toLocaleDateString("en-GB", options)}
                    key={i}
                />
            );
            curDate.setDate(curDate.getDate() + 1);
        }

        return headers;
    }

    function generateTableBody() {
        const fifteenMinIntervalInDay = 1440 / 15;
        const body = Array.from({ length: fifteenMinIntervalInDay }, () => new Array(diff + 1).fill(0));
        const intervals = generateTimeIntervals();

        // Fill availability data
        for (let i = 0; i < fifteenMinIntervalInDay; i++) {
            for (let j = 0; j <= diff; j++) {
                if (availability[fifteenMinIntervalInDay * j + i] !== 0) {
                    body[i][j] = availability[fifteenMinIntervalInDay * j + i];
                }
            }
        }

        return body.map((row, rowIndex) => (
            <TableRow key={rowIndex} time={intervals[rowIndex]} rowData={row} />
        ));
    }

    return (
        <>
            {isLoading ? ( // Conditional rendering for loading state
                <div className="flex h-full">
                    <p>Loading availability...</p> {/* Display loading message */}
                </div>
            ) : (
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
            )}
        </>
    )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500 whitespace-nowrap px-2">{title}</th>
}

function TableRow({ time, rowData }: { time: string; rowData: number[] }) {
    return (
        <tr>
            <td className="border border-slate-500 px-2">{time}</td>
            {rowData.map((col, idx) => (
                <td
                    key={idx}
                    className={`h-[10px] w-[30px] border border-slate-500 ${
                        col === 0 ? "" : "bg-green-800"
                    }`}
                ></td>
            ))}
        </tr>
    );
};