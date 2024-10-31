"use client"

import { MeetgridEvent } from "@/server/entity/event";

interface AvailabilityProps {
    period: number;
    eventInformation: MeetgridEvent;
}

export function GroupAvailability({ period, eventInformation } : AvailabilityProps) {
    const availability = eventInformation.eventAvailability!.split(",").map((str: string) => parseInt(str));
    const startDate = new Date(eventInformation.startDate!);
    const startDateOffset = startDate.getDay();
    const endDate = new Date(eventInformation.endDate!);
    const interval = availability.length * 15 / 1440
    const offset = startDate.getDay() + 6 - endDate.getDay();
    const diff = (endDate-startDate) / (1000 * 60 * 60 * 24);

    
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
        const fifteenMinIntervalInDay = 1440 / 15;
        const body = Array.from({ length: fifteenMinIntervalInDay }, () => new Array(interval + offset).fill(0));

        const result = []
        for (let i=0;i<fifteenMinIntervalInDay;i++) {
            for (let j=0;j<=diff; j++) {
                if (availability[fifteenMinIntervalInDay*j + i] != 0) {
                    body[i][j+startDateOffset] = availability[fifteenMinIntervalInDay*j + i]
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