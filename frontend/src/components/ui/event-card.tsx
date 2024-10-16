import { MeetgridEvent } from "@/server/entity/event";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

export function HomeEventCard({event} : {event: MeetgridEvent}) {
    return(
        <Card>
            <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <p>Start: {event.startDate?.toString()}</p>
                <p>End: {event.endDate?.toString()}</p>
            </CardFooter>
        </Card>
    )
}