"use client"

import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant"
import { useState } from "react";

interface IndicateAvailabilityProps {
    eventParticipant: MeetgridEventParticipant;
    event: MeetgridEvent;
    userEmail: string;
}

export default function IndicateAvailability({ eventParticipant, event, userEmail} : IndicateAvailabilityProps) {
    
    const diff = (+(new Date(event.endDate)) - +(new Date(event.startDate))) / (1000*60*60*24);
    console.log(diff)

    function generateTableHeaders() {
        const headers = [<TableHeader title="Time" key="time-header" />];
        const curDate = new Date(event.startDate);
        const options = { weekday: "short", day: "2-digit", month: "short" }
        
        curDate.setDate(curDate.getDate());
        for (let i=0; i <= diff; i++) {
            headers.push(<TableHeader key={i} title={curDate.toLocaleDateString("en-GB", options)}/>)
            curDate.setDate(curDate.getDate() + 1)
        }

        return headers;
    }

    return (
        <table className="table-auto overflow-x-auto">
            <thead>
                <tr>
                    {generateTableHeaders()}
                </tr>
            </thead>
            <TableBody event={event} eventParticipant={eventParticipant} userEmail={userEmail}/>
        </table>
    )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500 whitespace-nowrap px-2">{title}</th>
}

interface TableBodyProps {
    eventParticipant: MeetgridEventParticipant;
    userEmail: string;
    event: MeetgridEvent;
}

function TableBody({ eventParticipant, event, userEmail }: TableBodyProps) {

    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const availability: {[key: string]: string}[][] = JSON.parse(eventParticipant.availabilityString);

    function handleOnMouseDown(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, timeIntervalIdx: number, dayIdx: number) {
        const { target } = e;

            if (availability[timeIntervalIdx][dayIdx].hasOwnProperty(userEmail)) {
                setIsDelete(true);
            } else {
                setIsDelete(false);
            }
            setIsMouseDown(true);

        if (target instanceof HTMLElement) {
            if (isDelete) {
                delete availability[timeIntervalIdx][dayIdx][userEmail];
                target.classList.remove("bg-green-800");
                target.classList.add("bg-red-200");
            } else {
                availability[timeIntervalIdx][dayIdx][userEmail] = "";
                target.classList.remove("bg-red-200");
                target.classList.add("bg-green-800");
            }
        }
    }

    function handleOnMouseEnter(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, timeIntervalIdx: number, dayIdx: number) {
        if (!isMouseDown) return;

        const { target } = e;
        console.log(target)
        if (target instanceof HTMLElement) {
            if (isDelete) {
                delete availability[timeIntervalIdx][dayIdx][userEmail];
                target.classList.remove("bg-green-800");
                target.classList.add("bg-red-200");
            } else {
                availability[timeIntervalIdx][dayIdx][userEmail] = "";
                target.classList.remove("bg-red-200");
                target.classList.add("bg-green-800");
            }
        }
    }

    async function handleOnMouseUp() {
        setIsMouseDown(false);

        eventParticipant.availabilityString = JSON.stringify(availability);
        const result = await fetch("/api/eventParticipant", {
            "method": "PUT",
            "body": JSON.stringify(eventParticipant)
        });

        console.log(result);
    }

    return(
        <tbody>
            {availability.map((timeInterval, timeIntervalIdx) => {
                const currentTimeTotalMinutes = timeIntervalIdx * 15

                if (currentTimeTotalMinutes < event.startTimeMinutes || currentTimeTotalMinutes >= event.endTimeMinutes) return;
                
                let currentTimeMinutes = (currentTimeTotalMinutes % 60).toString();
                let currentTimeHours = (currentTimeTotalMinutes / 60 >> 0).toString();

                if (currentTimeHours.length === 1) currentTimeHours = "0" + currentTimeHours
                if (currentTimeMinutes.length === 1) currentTimeMinutes = "0" + currentTimeMinutes

                return (
                    <tr key={timeIntervalIdx}>
                        <td className="border border-slate-500 text-center select-none">{currentTimeHours} : {currentTimeMinutes}</td>
                        {
                            timeInterval.map((day, dayIdx) => {
                                if (availability[timeIntervalIdx][dayIdx].hasOwnProperty(userEmail)) {
                                    return <td onMouseDown={(e) => handleOnMouseDown(e, timeIntervalIdx, dayIdx)} onMouseEnter={(e) => handleOnMouseEnter(e, timeIntervalIdx, dayIdx)} onMouseUp={() => handleOnMouseUp()} key={dayIdx} className="border border-slate-500 bg-green-800"/>
                                } else {
                                    return <td onMouseDown={(e) => handleOnMouseDown(e, timeIntervalIdx, dayIdx)} onMouseEnter={(e) => handleOnMouseEnter(e, timeIntervalIdx, dayIdx)} onMouseUp={() => handleOnMouseUp()} key={dayIdx} className="border border-slate-500 bg-red-200"/>
                                }
                            })
                        }
                    </tr>
                )   
            })}
        </tbody>
    )
}