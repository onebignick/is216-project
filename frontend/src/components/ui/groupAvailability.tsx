"use client"

import { MeetgridEvent } from "@/server/entity/event";

interface AvailabilityProps {
    period: number;
    eventInformation: MeetgridEvent;
}

export function GroupAvailability({ period, eventInformation } : AvailabilityProps) {
    const availability = eventInformation.eventAvailability!.split(",").map((str: string) => parseInt(str));
    const startDate = new Date(eventInformation.startDate!);
    const endDate = new Date(eventInformation.endDate!);
    const interval = availability.length * 15 / 1440
    const offset = startDate.getDay() + 6 - endDate.getDay();
    
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
        const body = Array(fifteenMinIntervalInDay).fill(
            Array(interval+offset).fill(0)
        );

        const result = []
        for (let i=startDate.getDay(); i < body.length - (7 - endDate.getDay()); i++) {
            for (let j=0;j<body[i].length;j++) {
                body[i][j] = availability[i-startDate.getDay()+j]
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
            {table.map(( col, idx ) => {
                return (
                    <tr key={idx}>
                        {
                            col.map(( row, idx ) => {
                                if (!row) return <td key={idx} className="min-h-[10px] min-w-[30px] border border-slate-500"></td>
                                else return <td key={idx} className="h-[10px] w-[30px] bg-green-800"></td>
                            })
                        }
                    </tr>
                )
            })}
        </>
    )
}