import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";
import { FormDialogButton } from "./FormDialogButton";
import { RegisterForTimeslotForm } from "./forms/RegisterForTimeslotForm";

interface RegisterForAvailableSessionsProps {
    totalAvailability: MeetgridEventParticipant[];
    event: MeetgridEvent;
}

export default function RegisterForAvailableSessions({totalAvailability, event} : RegisterForAvailableSessionsProps) {

  const diff = (+(new Date(event.endDate)) - +(new Date(event.startDate))) / (1000*60*60*24);
  let maxAvailability = 0;
  const availability = mergeTotalAvailabilityArray(totalAvailability);

  function mergeTotalAvailabilityArray(totalAvailability: MeetgridEventParticipant[]) {
    let availability = null;
    console.log("totalAvailability", totalAvailability)
    for (let i=0;i<totalAvailability.length;i++) {
      const currentParticipant = totalAvailability[i];
      if (currentParticipant.role === "participant") continue;

      const currentAvailability = JSON.parse(currentParticipant.availabilityString);
      if (availability === null) availability = currentAvailability;
      else {
        for(let j=0;j<availability.length;j++) {
          for(let k=0;k<availability[j].length;k++) {
            availability[j][k] = {...availability[j][k], ...currentAvailability[j][k]}
          }
        }
      }
    }

    for (let i=0; i< availability.length; i++) {
      for (let j=0;j<availability[i].length;j++) {
        maxAvailability = Math.max(maxAvailability, Object.keys(availability[i][j]).length)
      }
    }
    return availability;
  }

  function generateTableHeaders() {
      const headers = [<TableHeader title="Time" key="time-header" />];
      const curDate = new Date(event.startDate);
      const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "short", timeZone: "Asia/Singapore" }
      
      curDate.setDate(curDate.getDate());
      for (let i=0; i <= diff; i++) {
          headers.push(<TableHeader key={i} title={curDate.toLocaleDateString("en-SG", options)}/>)
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
        <TableBody mergedAvailability={availability} event={event}/>
    </table>
  )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500 whitespace-nowrap w-[10px] px-2">{title}</th>
}

interface TableBodyProps {
    mergedAvailability: {[key: string]: string}[][];
    event: MeetgridEvent
}

function TableBody({ mergedAvailability, event }: TableBodyProps) {
    return (
        <tbody>
            {mergedAvailability.map((timeslot, timeslotIdx) => {

                const currentTimeTotalMinutes = timeslotIdx * 30
                if (currentTimeTotalMinutes < event.startTimeMinutes || currentTimeTotalMinutes >= event.endTimeMinutes) return;
                
                let currentTimeMinutes = (currentTimeTotalMinutes % 60).toString();
                let currentTimeHours = (currentTimeTotalMinutes / 60 >> 0).toString();

                if (currentTimeHours.length === 1) currentTimeHours = "0" + currentTimeHours
                if (currentTimeMinutes.length === 1) currentTimeMinutes = "0" + currentTimeMinutes

                return (
                    <tr key={timeslotIdx}>
                        <td className="border border-slate-500 w-[30px] h-[10px] select-none text-center">{currentTimeHours} : {currentTimeMinutes}</td>
                        {timeslot.map((day, dayIdx) => {
                            if (Object.keys(mergedAvailability[timeslotIdx][dayIdx]).length === 0) {
                                return <td key={dayIdx} className="border border-slate-500 w-[30px] h-[10px]"></td>
                            } else {
                                let emptyCount = 0
                                for (const key in mergedAvailability[timeslotIdx][dayIdx]) {
                                    if (mergedAvailability[timeslotIdx][dayIdx][key] === "") emptyCount++;
                                }

                                if (emptyCount != 0) {
                                    return (
                                        <td key={dayIdx} className="border border-slate-500">
                                            <div className="flex justify-center items-center h-full py-1 px-2"> {/* Center the button */}
                                                <FormDialogButton
                                                    label="Book This Time Slot"
                                                    title={`Confirm booking for ${currentTimeHours}:${currentTimeMinutes}`}
                                                    description="An email will be sent to you to confirm the booking"
                                                    form={<RegisterForTimeslotForm mergedAvailability={mergedAvailability} event={event} timeslotIdx={timeslotIdx} dayIdx={dayIdx}/>}
                                                />
                                            </div>
                                        </td>
                                    )
                                } else {
                                    return <td key={dayIdx} className="border border-slate-500 bg-neutral-500"></td>
                                }
                            }
                        })}
                    </tr>
                )
            })}
        </tbody>
    )
}