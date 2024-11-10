"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function CancelInterviewForm({ params } : { params: { interviewId: string }}) {

    const router = useRouter();

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>What would you like to do with your interview appointment?</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary" onClick={async () => {
                        const targetEventResponse = await fetch("/api/eventRegistrant?" + new URLSearchParams({
                            meetgridEventRegistrantId: params.interviewId,
                        }));
                        const { meetgridEventRegistrant } = await targetEventResponse.json();
                        console.log(meetgridEventRegistrant)
                        await fetch("/api/eventRegistrant", {
                            method: "DELETE",
                            body: JSON.stringify({eventRegistrantIdToDelete: params.interviewId})  
                        });
                        router.push("/event/"+meetgridEventRegistrant.eventId+"/register")
                    }}>Update</Button>
                    <Button variant="destructive">Cancel</Button>
                </CardContent>
            </Card>
        </div>
    )
}