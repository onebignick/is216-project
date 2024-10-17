import { MeetgridEvent } from "@/server/entity/event";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import Link from "next/link";

export function HomeEventCard({event} : {event: MeetgridEvent}) {
    return(
        <Card>
            <CardHeader>
                <CardTitle>
                    <Link href={`/events/${event.id}`}>{event.name}</Link>
                </CardTitle>
                <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <p>Start: {event.startDate?.toString()}</p>
                <p>End: {event.endDate?.toString()}</p>
            </CardFooter>
        </Card>
    )
}