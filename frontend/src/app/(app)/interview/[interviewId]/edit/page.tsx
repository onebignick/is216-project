"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelInterviewForm({ params } : { params: { interviewId: string }}) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>What would you like to do with your interview appointment?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row gap-4">
                { 
                    !isLoading ? 
                        <Button variant="secondary" onClick={async () => {
                            setIsLoading(true);
                            const targetEventResponse = await fetch("/api/eventRegistrant?" + new URLSearchParams({
                                meetgridEventRegistrantId: params.interviewId,
                            }));
                            const { meetgridEventRegistrant } = await targetEventResponse.json();

                            await fetch("/api/eventRegistrant", {
                                method: "DELETE",
                                body: JSON.stringify({eventRegistrantIdToDelete: params.interviewId})  
                            });

                            toast({
                                title: "Rebook Interview Complete!",
                                description: "You will be redirected to the interview page to choose a different timeslot in 3 seconds",
                                className: "bg-green-500 text-black",
                            });

                            setTimeout(() => {
                                setIsLoading(false);
                                router.push("/event/"+meetgridEventRegistrant.eventId+"/register")
                            }, 3000);
                        }}>
                            Rebook
                        </Button>
                    :
                        <Button disabled className="col-span-2 bg-indigo-300">
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button>
                }
                { 
                    !isLoading ? 
                        <Button variant="destructive" onClick={async () => {
                            await fetch("/api/eventRegistrant", {
                                method: "DELETE",
                                body: JSON.stringify({eventRegistrantIdToDelete: params.interviewId})  
                            });

                            toast({
                                title: "Interview Canceled!",
                                description: "You will be redirected to the register page in 3 seconds",
                                className: "bg-500-500 text-white",
                            });

                            setTimeout(() => {
                                setIsLoading(false);
                                router.push("/event/register")
                            }, 3000);
                        }}>
                            Cancel
                        </Button>
                    :
                        <Button disabled className="col-span-2 bg-indigo-300">
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button>
                }
                </CardContent>
            </Card>
        </div>
    )
}