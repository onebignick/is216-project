"use client"

import { useEffect, useState } from "react";
import { MeetgridEvent } from "@/server/entity/event";
import { MeetgridAvailability } from "@/server/entity/availability";

interface AvailabilityProps {
    eventInformation: MeetgridEvent;
}

const fifteenMinIntervalInDay = 1440 / 15;

export function Availability({ eventInformation } : AvailabilityProps) {
    const [userAvailability, setUserAvailability] = useState<number[]>([]);
    const [userAvailabilityObject, setUserAvailabilityObject] = useState<MeetgridAvailability>();
    const startDate = new Date(eventInformation.startDate!);
    const endDate = new Date(eventInformation.endDate!);
    const diff = (+endDate - +startDate) / (1000 * 60 * 60 * 24);

    useEffect(() => {
        async function handleUserAvailability() {
            const res = await fetch("/api/event/availability?" + new URLSearchParams({
                eventId: eventInformation.id!
            }));
            const { result } = await res.json();

            let newUserAvailability: number[];
            if (result.length === 0) {
                newUserAvailability = Array(672).fill(0);
                
                // create new userAvailability
                const availabilityObject: MeetgridAvailability  = {
                    availabilityString: newUserAvailability.toString(),
                    eventId: eventInformation.id!
                }

                const res = await fetch("/api/event/availability", {
                    method: "POST",
                    body: JSON.stringify({
                        meetgridAvailability: availabilityObject
                    })
                })
                const response = await res.json();
                setUserAvailabilityObject(response.result[0]);
            } else {
                setUserAvailabilityObject(result[0]);
                newUserAvailability = result[0].availabilityString.split(",").map((str: string) => parseInt(str))
            }
            setUserAvailability(newUserAvailability);
        }

        handleUserAvailability();
    }, [])

    // Generate 15-minute time intervals
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
        const curDate = startDate;
        const options = { weekday: "short", day: "2-digit", month: "short" }
        
        curDate.setDate(curDate.getDate());
        for (let i=0; i <= diff; i++) {
            headers.push(<TableHeader title={curDate.toLocaleDateString("en-GB", options)} key={`header-${i}`} />)
            curDate.setDate(curDate.getDate() + 1)
        }

        return headers;
    }


    function generateTableBody() {
        const body = Array.from({ length: fifteenMinIntervalInDay }, () => new Array(diff+1).fill(0));
        const timeIntervals = generateTimeIntervals();

        const result = []
        for (let i=0;i<fifteenMinIntervalInDay;i++) {
            for (let j=0;j<=diff; j++) {
                if (userAvailability![fifteenMinIntervalInDay*j + i] != 0) {
                    body[i][j] = userAvailability![fifteenMinIntervalInDay*j + i]
                }
            }
        }
        result.push(<TableRow table={body} interval={diff} meetgridAvailability={userAvailabilityObject!} timeIntervals={timeIntervals} startTime={eventInformation.startTime!} endTime={eventInformation.endTime!}/>);

        return result;
    }

    return (
        <>
            <table className="border border-collapse border-slate-500">
                <thead>
                    <tr>
                        {userAvailability ? generateTableHeaders() : null}
                    </tr>
                </thead>
                <tbody>
                    {userAvailability ? generateTableBody() : null}                   
                </tbody>
            </table>
        </>
    )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500 whitespace-nowrap px-2">{title}</th>
}

function TableRow({ table, interval, meetgridAvailability, timeIntervals, startTime, endTime }: { table: number[][], interval: number, meetgridAvailability: MeetgridAvailability, timeIntervals: string[], startTime: number, endTime: number }) {
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [currentBg, setCurrentBg] = useState<number>(0);

    function handleMouseDown(row: number, col: number) {
        setIsMouseDown(true);

        if (table[row][col]) {
            setCurrentBg(0);
        } else {
            setCurrentBg(1);
        }
        table[row][col] = currentBg;
    }

    function handleMouseEnter(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, row: number, col: number) {
        const { target } = e;
        if (isMouseDown && target instanceof HTMLElement) {
            if (!currentBg) {
                target.classList.remove("bg-green-800");
                target.classList.add("bg-red-200");
            } else {
                target.classList.remove("bg-red-200");
                target.classList.add("bg-green-800");
            }
            // else e.target.classList.add("bg-green-800");
            table[row][col] = currentBg;
        }
    }

    async function handleMouseUp() {
        setIsMouseDown(false);

        const newUserAvailability = [];
        for (let j=0; j<=interval; j++) {
            for (let i=0;i<fifteenMinIntervalInDay;i++) {
                newUserAvailability.push(table[i][j]);
            }
        }

        const newUserAvailabilityObject = { ...meetgridAvailability }
        newUserAvailabilityObject.availabilityString = newUserAvailability.toString();
        const res = await fetch("/api/event/availability", {
            method: "PUT",
            body: JSON.stringify({
                eventAvailability: newUserAvailabilityObject
            })
        })
        const response = await res.json();
        console.log(response);;
    }

    return (
        <>
            {table.map(( row, idy ) => {
                const curTime = idy*15;
                if (curTime < startTime || curTime >= endTime) return;

                return (
                    <tr key={idy}>
                        <td className="border border-slate-500 px-2">{timeIntervals[idy]}</td> {/* Timing Column */}
                        {
                            row.map(( col, idx ) => {
                                return (
                                    <td 
                                        key={idx} 
                                        className={"h-[10px] w-[30px] border border-slate-500 hover:bg-green-800 " + (table[idy][idx] ? "bg-green-800" : "bg-red-200")}
                                        onMouseDown={() => {
                                            handleMouseDown(idy, idx)
                                        }}
                                        onMouseEnter={(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => handleMouseEnter(e, idy, idx)}
                                        onMouseUp={() => handleMouseUp()}
                                    >
                                    </td>
                                )
                            })
                        }
                    </tr>
                )
            })}
        </>
    )
}