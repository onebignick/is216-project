"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MeetgridBookEvent } from "@/server/entity/booking";

// Types for event and booking events
interface Question {
    key: string;
    prompt: string;
    answer?: string;
}

interface Event {
    id?: string;
    name: string | null;
    date: string | null;
    startTime?: number | null;
    status: string;
    questions?: Question[];
}

interface participantsInformationProps {
    participantsInformation: MeetgridBookEvent[];
}

export function InterviewNotes({ participantsInformation }: participantsInformationProps) {
    const hasParticipants = participantsInformation && participantsInformation.length > 0;

    // Helper function to format the date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="relative p-6 h-screen flex flex-col space-y-6">
            {hasParticipants ? (
                <Table className="table-auto border-collapse w-full mb-8">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border px-4 py-2">Name</TableHead>
                            <TableHead className="border px-4 py-2">Date</TableHead>
                            <TableHead className="border px-4 py-2">Interview Timing</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participantsInformation.map((participant, index) => (
                            <TableRow key={index}>
                                <TableCell className="border px-4 py-2">{participant.name}</TableCell>
                                <TableCell className="border px-4 py-2">{formatDate(participant.date)}</TableCell>
                                <TableCell className="border px-4 py-2">{participant.startTime?.toString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p>No participants yet. Invite people to join your event.</p>
                    <Link href="/add-participants">
                        <Button className="mt-4">Add Participants</Button>
                    </Link>
                </div>
            )}

        </div>
    );
}
