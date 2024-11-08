"use client"

import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant"
import { useState } from "react";

interface IndicateAvailabilityProps {
    eventParticipant: MeetgridEventParticipant;
    event: MeetgridEvent;
    userEmail: string;
}

export default function IndicateAvailability({eventParticipant, event} : IndicateAvailabilityProps) {
    
    const [availability, setAvailability] = useState<string[][][]>(JSON.parse(eventParticipant.availabilityString))
    const diff = +(new Date(event.startDate)) - +(new Date(event.endDate)) + 1;


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
        <table>
            <thead>
                <tr>
                    {generateTableHeaders()}
                </tr>
            </thead>
        </table>
    )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500 whitespace-nowrap px-2">{title}</th>
}

function TableRow({ currentTimeIdx, row, maxAvailability }: { currentTimeIdx: number, row: string[][], maxAvailability: number}) {
  const currentTimeTotalMinutes = currentTimeIdx * 15
  
  let currentTimeMinutes = (currentTimeTotalMinutes % 60).toString();
  let currentTimeHours = (currentTimeTotalMinutes / 60 >> 0).toString();

  if (currentTimeHours.length === 1) currentTimeHours = "0" + currentTimeHours
  if (currentTimeMinutes.length === 1) currentTimeMinutes = "0" + currentTimeMinutes

  return (
    <tr key={currentTimeIdx}>
      <td className="border border-slate-500 w-[30px] h-[10px] select-none">{currentTimeHours} : {currentTimeMinutes}</td>
      {row.map((col, idx) => {
        if (col.length === 0) {
          return <td key={idx} className="border border-slate-500 w-[30px] h-[10px]"></td>
        } else if (col.length === maxAvailability) {
          return <td key={idx} className="border border-slate-500 bg-green-800 w-[30px] h-[10px]"></td>
        } else {
          return <td key={idx} className={"border border-slate-500 bg-green-800 w-[30px] h-[10px] opacity-" + (100 -(col.length/maxAvailability * 100))}></td>
        }
      })}
    </tr>
  )
}