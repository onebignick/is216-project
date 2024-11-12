"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelInterviewForm({ params } : { params: { interviewId: string }}) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedAction, setSelectedAction] = useState<"rebook" | "cancel" | null>(null); // Track selected action
    const { toast } = useToast();
    const router = useRouter();

    return (
        <section className="my-5 grid grid-cols-12">
            <div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-4 md:col-span-7 flex justify-center">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-center">What would you like to do with your interview appointment?</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                    { 
                        !isLoading ? 
                            <Button variant="secondary" onClick={async () => {
                                setIsLoading(true);
                                const targetEventResponse = await fetch("/api/eventRegistrant?" + new URLSearchParams({
                                    meetgridEventRegistrantId: params.interviewId,
                                }));
                                const { meetgridEventRegistrant } = await targetEventResponse.json();

                                const rebookEventResponse = await fetch("/api/eventRegistrant", {
                                    method: "DELETE",
                                    body: JSON.stringify({eventRegistrantIdToDelete: params.interviewId})  
                                });

                                if (rebookEventResponse.ok) {
                                    toast({
                                        title: "Rebook Interview Complete!",
                                        description: "You will be redirected to the interview page to choose a different timeslot in 3 seconds",
                                        className: "bg-green-500 text-black",
                                    });
                                } else {
                                    toast({
                                        title: "Uh oh something went wrong!",
                                        description: "Something went wrong when trying to rebook event",
                                        className: "bg-red-500 text-white", // Error color
                                    })
                                }


                                setTimeout(() => {
                                    setIsLoading(false);
                                    setSelectedAction(null);
                                    router.push("/event/"+meetgridEventRegistrant.eventId+"/register")
                                }, 3000);
                            }}>
                                {selectedAction === "rebook" && isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                  Rebook
                            </Button>
                        :
                        
                            <Button disabled className="col-span-1 bg-coral text-black hover:bg-coral/70">
                                <Loader2 className="animate-spin"/>
                                Please wait
                            </Button>
                    }
                    { 
                        !isLoading ? 
                            <Button variant="destructive" onClick={async () => {
                                const deleteEventResponse = await fetch("/api/eventRegistrant", {
                                    method: "DELETE",
                                    body: JSON.stringify({eventRegistrantIdToDelete: params.interviewId})  
                                });

                                if (deleteEventResponse.ok) {
                                    toast({
                                        title: "Interview Canceled!",
                                        description: "You will be redirected to the register page in 3 seconds",
                                        className: "bg-green-500 text-black",
                                    });
                                } else {
                                    toast({
                                        title: "Uh oh something went wrong!",
                                        description: "Something went wrong when trying to delete event",
                                        className: "bg-red-500 text-white", // Error color
                                    })
                                }

                                setTimeout(() => {
                                    setIsLoading(false);
                                    setSelectedAction(null); // Reset selected action
                                    router.push("/event/register")
                                }, 3000);
                            }}>
                               {selectedAction === "cancel" && isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                               Cancel
                            </Button>
                        :
                            <Button disabled className="col-span-1 bg-coral text-black hover:bg-coral/70">
                                <Loader2 className="animate-spin"/>
                                Please wait
                            </Button>
                    }
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}