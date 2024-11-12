"use client"

import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant"
import { useRouter } from 'next/navigation';
import { useState } from "react";

interface IndicateAvailabilityProps {
    eventParticipant: MeetgridEventParticipant;
    event: MeetgridEvent;
    userEmail: string;
}

export default function IndicateAvailability({ eventParticipant, event, userEmail} : IndicateAvailabilityProps) {
    
    const diff = (+(new Date(event.endDate)) - +(new Date(event.startDate))) / (1000*60*60*24);

    function generateTableHeaders() {
        const headers = [<TableHeader title="Time" key="time-header" />];
        const curDate = new Date(event.startDate);
        const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "short" }
        
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
    const [availability, setAvailability] = useState<{ [key: string]: string }[][]>(JSON.parse(eventParticipant.availabilityString));
    const router = useRouter();

    function handleOnMouseDown(e: React.MouseEvent<HTMLTableCellElement, MouseEvent> | React.TouchEvent<HTMLTableCellElement>, timeIntervalIdx: number, dayIdx: number) {
        // const { target } = e;
        e.preventDefault(); // Prevents unintended behavior on mobile

        // Type guard to distinguish between MouseEvent and TouchEvent
        const isTouchEvent = 'touches' in e;
        const target = isTouchEvent ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;
        
        if (target instanceof HTMLElement) {
            if (availability[timeIntervalIdx][dayIdx].hasOwnProperty(userEmail)) {
                setIsDelete(true);
            } else {
                setIsDelete(false);
            }
            setIsMouseDown(true);
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

    function handleOnMouseEnter(e: React.MouseEvent<HTMLTableCellElement> | React.TouchEvent<HTMLTableCellElement>, timeIntervalIdx: number, dayIdx: number) {
        if (!isMouseDown) return;

        // const { target } = e;
        e.preventDefault();
        const isTouchEvent = 'touches' in e;
        const target = isTouchEvent ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;

        if (target instanceof HTMLTableCellElement && target.classList.contains("selectable")) {
            console.log("hey")
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
        
        router.refresh();
        console.log(result);
    }

    const handleOnClick = async (timeIntervalIdx: number, dayIdx: number) => {
        const updatedAvailability = [...availability];
        const targetCell = updatedAvailability[timeIntervalIdx][dayIdx];
        
        // Toggle the availability status for this cell
        if (targetCell.hasOwnProperty(userEmail)) {
            delete targetCell[userEmail];
            setIsDelete(true);
        } else {
            targetCell[userEmail] = "";
            setIsDelete(false);
        }

        // Update the state with the new availability data
        setAvailability(updatedAvailability);

        // Save to the database
        eventParticipant.availabilityString = JSON.stringify(updatedAvailability);
        const result = await fetch("/api/eventParticipant", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventParticipant),
        });

        const data = await result.json();
        router.refresh();
        console.log("Saved data:", data);
    };


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
                                    return <td onMouseDown={(e) => handleOnMouseDown(e, timeIntervalIdx, dayIdx)} onMouseEnter={(e) => handleOnMouseEnter(e, timeIntervalIdx, dayIdx)} onMouseUp={() => handleOnMouseUp()} onTouchStart={(e) => handleOnMouseDown(e, timeIntervalIdx, dayIdx)} onTouchMove={(e) => handleOnMouseEnter(e, timeIntervalIdx, dayIdx)} onTouchEnd={() => handleOnMouseUp()} key={dayIdx} onClick={() => handleOnClick(timeIntervalIdx, dayIdx)} className="border border-slate-500 bg-green-800 selectable"/>
                                } else {
                                    return <td onMouseDown={(e) => handleOnMouseDown(e, timeIntervalIdx, dayIdx)} onMouseEnter={(e) => handleOnMouseEnter(e, timeIntervalIdx, dayIdx)} onMouseUp={() => handleOnMouseUp()} onTouchStart={(e) => handleOnMouseDown(e, timeIntervalIdx, dayIdx)} onTouchMove={(e) => handleOnMouseEnter(e, timeIntervalIdx, dayIdx)} onTouchEnd={() => handleOnMouseUp()} key={dayIdx} onClick={() => handleOnClick(timeIntervalIdx, dayIdx)} className="border border-slate-500 bg-red-200 selectable"/>
                                }
                            })
                        }
                    </tr>
                )   
            })}
        </tbody>
    )
}