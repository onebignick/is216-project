import { MeetgridEvent } from "@/server/entity/event";
import { Button } from "./button";

interface AvailabilityProps {
    availability: number[]
    eventInformation: MeetgridEvent;
}

export function ParticipantAvailability({ availability, eventInformation } : AvailabilityProps) {

    const startDate = new Date(eventInformation.startDate!);
    const endDate = new Date(eventInformation.endDate!);
    const diff = (+endDate - +startDate) / (1000 * 60 * 60 * 24);

    
    function generateTableHeaders() {
        const headers = [<th key={-1}></th>];
        const curDate = startDate;
        const options = { weekday: "short", day: "2-digit", month: "short" }
        
        curDate.setDate(curDate.getDate());
        for (let i=0; i <= diff; i++) {
            headers.push(<TableHeader key={i} title={curDate.toLocaleDateString("en-GB", options)}/>)
            curDate.setDate(curDate.getDate() + 1)
        }

        return headers;
    }

    function generateTableBody() {
        const fifteenMinIntervalInDay = 1440 / 15;
        const body = Array.from({ length: fifteenMinIntervalInDay }, () => new Array(diff+2).fill(0));

        const result = []
        for (let i=0;i<fifteenMinIntervalInDay;i++) {
            for (let j=0;j<=diff; j++) {
                if (availability![fifteenMinIntervalInDay*j + i] != 0) {
                    body[i][j+1] = availability![fifteenMinIntervalInDay*j + i]
                }
            }
        }

        result.push(
            <TableRow
                key={-1} 
                table={body} 
                startTime={eventInformation.startTime!} 
                endTime={eventInformation.endTime!}
                interval={eventInformation.interval!}
            />
        )

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

function TableRow({ table, startTime, endTime, interval }: { table: number[][], startTime: number, endTime: number, interval: number}) {
    return (
        <>
            {table.map(( row, idy ) => {
                const curTime = idy*15;
                if (curTime < startTime || curTime >= endTime) return;
                if (idy % interval != 0) return;

                return (
                    <tr key={idy}>
                        {
                            row.map(( col, idx ) => {
                                if (idx == 0) {
                                    let startHour = (curTime/60 >> 0).toString();
                                    if (startHour.length == 1) startHour = "0" + startHour;

                                    let startMinute = (curTime%60).toString();
                                    if (startMinute.length == 1) startMinute = "0" + startMinute;

                                    return <td key={idx} className="h-[10px] w-[30px] border border-slate-500">
                                        {startHour + startMinute}
                                    </td>
                                }
                                else if (col === 0) {
                                    return ( 
                                        <td key={idx} className="h-[10px] w-[30px] border border-slate-500">
                                        </td>
                                    )
                                }
                                else {
                                    return (
                                        <td key={idx} className="h-[10px] w-[30px] bg-green-800 border border-slate-500">
                                            <Button>Register</Button>
                                        </td>
                                    );
                                }
                            })
                        }
                    </tr>
                )
            })}
        </>
    )
}