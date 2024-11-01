"use client"

import { useEffect, useState } from "react";
import { Button } from "./button";
import { MeetgridEvent } from "@/server/entity/event";
import { MeetgridAvailability } from "@/server/entity/availability";

interface AvailabilityProps {
    days: number;
    period: number;
    currentAvailability: number[]
    setCurrentAvailability: any;
    eventInformation: MeetgridEvent;
}

const fifteenMinIntervalInDay = 1440 / 15;

export function Availability({ days, period, currentAvailability, setCurrentAvailability, eventInformation } : AvailabilityProps) {
    const [userAvailability, setUserAvailability] = useState<number[]>();
    const [userAvailabilityObject, setUserAvailabilityObject] = useState<MeetgridAvailability>();
    const availability = eventInformation.eventAvailability!.split(",").map((str: string) => parseInt(str));
    const startDate = new Date(eventInformation.startDate!);
    const startDateOffset = startDate.getDay();
    const endDate = new Date(eventInformation.endDate!);
    const interval = availability.length * 15 / 1440
    const offset = startDate.getDay() + 6 - endDate.getDay();
    const diff = (endDate-startDate) / (1000 * 60 * 60 * 24);

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


    function generateTableHeaders() {
        const headers = [];
        const curDate = startDate;
        const options = { weekday: "short", day: "2-digit", month: "short" }
        
        curDate.setDate(curDate.getDate() - (curDate.getDay() % 7));
        for (let i=0; i < interval + offset; i++) {
            headers.push(<TableHeader title={curDate.toLocaleDateString("en-GB", options)}/>)
            curDate.setDate(curDate.getDate() + 1)
        }

        return headers;
    }


    function generateTableBody() {
        const body = Array.from({ length: fifteenMinIntervalInDay }, () => new Array(interval + offset).fill(0));

        const result = []
        for (let i=0;i<fifteenMinIntervalInDay;i++) {
            for (let j=0;j<=diff; j++) {
                if (userAvailability![fifteenMinIntervalInDay*j + i] != 0) {
                    body[i][j+startDateOffset] = userAvailability![fifteenMinIntervalInDay*j + i]
                }
            }
        }
        result.push(<TableRow table={body} offset={startDateOffset} interval={interval} meetgridAvailability={userAvailabilityObject!}/>)

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
            <Button>Save</Button>
        </>
    )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500">{title}</th>
}

function TableRow({ table, offset, interval, meetgridAvailability }: { table: number[][], offset: number, interval: number, meetgridAvailability: MeetgridAvailability }) {
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [currentBg, setCurrentBg] = useState<number>(0);

    function handleMouseDown(e, row, col) {
        setIsMouseDown(true);

        if (table[row][col]) {
            setCurrentBg(0);
        } else {
            setCurrentBg(1);
        }
        table[row][col] = currentBg;
    }

    function handleMouseEnter(e, row, col) {
        if (isMouseDown) {
            if (!currentBg) {
                e.target.classList.remove("bg-green-800");
                e.target.classList.add("bg-red-200");
            } else {
                e.target.classList.remove("bg-red-200");
                e.target.classList.add("bg-green-800");
            }
            // else e.target.classList.add("bg-green-800");
            table[row][col] = currentBg;
        }
    }

    async function handleMouseUp(e) {
        setIsMouseDown(false);

        const newUserAvailability = [];
        for (let j=offset; j<interval+offset; j++) {
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
                return (
                    <tr key={idy}>
                        {
                            row.map(( col, idx ) => {
                                if (idx >= offset && idx < interval + offset) {
                                    return (
                                        <td 
                                            key={idx} 
                                            className={"h-[10px] w-[30px] border border-slate-500 hover:bg-green-800 " + (table[idy][idx] ? "bg-green-800" : "bg-red-200")}
                                            onMouseDown={(e) => {
                                                handleMouseDown(e, idy, idx)
                                            }}
                                            onMouseEnter={(e) => handleMouseEnter(e, idy, idx)}
                                            onMouseUp={(e) => handleMouseUp(e)}
                                        >
                                        </td>
                                    )
                                }
                                else {
                                    return (
                                        <td 
                                            key={idx} 
                                            className={"h-[10px] w-[30px] border border-slate-500"}
                                        >
                                        </td>
                                    )
                                }
                            })
                        }
                    </tr>
                )
            })}
        </>
    )
}