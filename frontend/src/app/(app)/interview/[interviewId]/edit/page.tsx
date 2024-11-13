"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelInterviewForm({ params }: { params: { interviewId: string }}) {

    const [isRebookLoading, setIsRebookLoading] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [selectedAction, setSelectedAction] = useState<"rebook" | "cancel" | null>(null); // Track selected action
    const { toast } = useToast();
    const router = useRouter();

    const handleRebook = async () => {
        setIsRebookLoading(true);
        const targetEventResponse = await fetch("/api/eventRegistrant?" + new URLSearchParams({
            meetgridEventRegistrantId: params.interviewId,
        }));
        const { meetgridEventRegistrant } = await targetEventResponse.json();

        const rebookEventResponse = await fetch("/api/eventRegistrant", {
            method: "DELETE",
            body: JSON.stringify({ eventRegistrantIdToDelete: params.interviewId })
        });

        if (rebookEventResponse.ok) {
            toast({
                title: "Rebook Interview Complete!",
                description: "You will be redirected to the interview page to choose a different timeslot in 3 seconds",
                className: "bg-green-500 text-black",
            });
            setTimeout(() => {
                setIsRebookLoading(false);
                setSelectedAction(null);
                router.push("/event/" + meetgridEventRegistrant.eventId + "/register");
            }, 3000);
        } else {
            toast({
                title: "Uh oh something went wrong!",
                description: "Something went wrong when trying to rebook event",
                className: "bg-red-500 text-white",
            });
            setIsRebookLoading(false); // Ensure loading state is reset on failure
        }
    };

    const handleCancel = async () => {
        setIsDeleteLoading(true);
        const deleteEventResponse = await fetch("/api/eventRegistrant", {
            method: "DELETE",
            body: JSON.stringify({ eventRegistrantIdToDelete: params.interviewId })
        });

        if (deleteEventResponse.ok) {
            toast({
                title: "Interview Canceled!",
                description: "You will be redirected to the register page in 3 seconds",
                className: "bg-green-500 text-black",
            });
            setTimeout(() => {
                setIsDeleteLoading(false);
                setSelectedAction(null); // Reset selected action
                router.push("/event/register");
            }, 3000);
        } else {
            toast({
                title: "Uh oh something went wrong!",
                description: "Something went wrong when trying to delete event",
                className: "bg-red-500 text-white",
            });
            setIsDeleteLoading(false); // Ensure loading state is reset on failure
        }
    };

    return (
        <section className="my-5 grid grid-cols-12">
            <div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-4 md:col-span-7 flex justify-center">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-center">What would you like to do with your interview appointment?</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button 
                            variant="secondary" 
                            onClick={handleRebook} 
                            disabled={isRebookLoading || isDeleteLoading}  // Disable when any button is loading
                        >
                            {isRebookLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Rebook
                                </>
                            ) : (
                                "Rebook"
                            )}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={isDeleteLoading || isRebookLoading}  // Disable when any button is loading
                        >
                            {isDeleteLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Cancel
                                </>
                            ) : (
                                "Cancel"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
