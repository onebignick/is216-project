import { MeetgridEvent } from "@/server/entity/MeetgridEvent";
import { MeetgridEventParticipant } from "@/server/entity/MeetgridEventParticipant";

interface DisplayTotalAvailabilityProps {
    totalAvailability: MeetgridEventParticipant[];
    event: MeetgridEvent;
}

export function DisplayTotalAvailability({totalAvailability, event} : DisplayTotalAvailabilityProps) {

  const diff = (+(new Date(event.endDate)) - +(new Date(event.startDate))) / (1000*60*60*24);
  let maxAvailability = 0;
  const availability = mergeTotalAvailabilityArray(totalAvailability);

  function mergeTotalAvailabilityArray(totalAvailability: MeetgridEventParticipant[]) {
    let availability = null;
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
      const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "short",  timeZone: "Asia/Singapore" }
      
      curDate.setDate(curDate.getDate());
      for (let i=0; i <= diff; i++) {
          headers.push(<TableHeader key={i} title={curDate.toLocaleDateString("en-SG", options)}/>)
          curDate.setDate(curDate.getDate() + 1)
      }

      return headers;
  }

  function generateTableBody() {
    const body = [];
    let startTimeIdx = event.startTimeMinutes/30 >> 0;
    const endTimeIdx = event.endTimeMinutes/30 >> 0;

    while (startTimeIdx < endTimeIdx) {
      body.push(<TableRow key={startTimeIdx} currentTimeIdx={startTimeIdx} row={availability[startTimeIdx]} maxAvailability={maxAvailability}/>);
      startTimeIdx++;
    }
    return body;
  }

  return (
    <table className="table-auto overflow-x-auto">
        <thead>
            <tr>
                {generateTableHeaders()}
            </tr>
        </thead>
        <tbody>
          {generateTableBody()}
        </tbody>
    </table>
  )
}

function TableHeader({ title }: {title: string}) {
    return <th className="border border-slate-500 whitespace-nowrap px-2">{title}</th>
}

// function TableRow({ currentTimeIdx, row, maxAvailability }: { currentTimeIdx: number, row: string[][], maxAvailability: number}) {
//   const currentTimeTotalMinutes = currentTimeIdx * 30
  
//   let currentTimeMinutes = (currentTimeTotalMinutes % 60).toString();
//   let currentTimeHours = (currentTimeTotalMinutes / 60 >> 0).toString();

//   if (currentTimeHours.length === 1) currentTimeHours = "0" + currentTimeHours
//   if (currentTimeMinutes.length === 1) currentTimeMinutes = "0" + currentTimeMinutes

//   return (
//     <tr key={currentTimeIdx}>
//       <td className="border border-slate-500 text-center select-none">{currentTimeHours} : {currentTimeMinutes}</td>
//       {row.map((col, idx) => {
//         if (Object.keys(col).length === 0) {
//           return <td key={idx} className="border border-slate-500 w-[30px] h-[10px]"></td>
//         } else if (Object.keys(col).length === maxAvailability) {
//           return <td key={idx} className="border border-slate-500 bg-green-800 w-[30px] h-[10px]"></td>
//         } else {
//           return <td key={idx} className={"border border-slate-500 bg-green-800 w-[30px] h-[10px] opacity-" + (100 -(Object.keys(col).length/maxAvailability * 100))}></td>
//         }
//       })}
//     </tr>
//   )
// }
function TableRow({ currentTimeIdx, row, maxAvailability }: { currentTimeIdx: number, row: {[key: string]: string}[], maxAvailability: number}) {
  const currentTimeTotalMinutes = currentTimeIdx * 30;
  
  let currentTimeMinutes = (currentTimeTotalMinutes % 60).toString();
  let currentTimeHours = (currentTimeTotalMinutes / 60 >> 0).toString();

  if (currentTimeHours.length === 1) currentTimeHours = "0" + currentTimeHours;
  if (currentTimeMinutes.length === 1) currentTimeMinutes = "0" + currentTimeMinutes;

  return (
    <tr key={currentTimeIdx}>
      <td className="border border-slate-500 text-center select-none">{currentTimeHours} : {currentTimeMinutes}</td>
      {row.map((col, idx) => {
        const availablePeople = Object.keys(col).join(" ");  // Ensure that each "col" has a availablePeople property

        if (Object.keys(col).length === 0) {
          return <td key={idx} className="border border-slate-500 w-[30px] h-[10px]"></td>;
        } else if (Object.keys(col).length === maxAvailability) {
          return (
            <td
              key={idx}
              className="border border-slate-500 bg-green-800 w-[30px] h-[10px] relative"
              title={availablePeople ? `Available People: ${availablePeople}` : 'No user'} // Show user ID on hover
            ></td>
          );
        } else {
          return (
            <td
              key={idx}
              className={"border border-slate-500 bg-green-800 w-[30px] h-[10px] opacity-" + (100 -(Object.keys(col).length/maxAvailability * 100))}
              title={availablePeople ? `Available People: ${availablePeople}` : 'No user'} // Show user ID on hover
            ></td>
          );
        }
      })}
    </tr>
  );
}