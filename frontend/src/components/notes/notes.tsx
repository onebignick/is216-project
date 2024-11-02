"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

interface Note {
    id: string;
    name: string;
    eventCode: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface NotesProps {
    notes: Note[];
}

export function NotesDisplay({ notes }: NotesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredNotes = notes.filter(note => {
        const nameMatch = note.name.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch = note.description.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || descriptionMatch;
    });

    if (!isMounted) {
        return null; // Prevent rendering before mount
    }

    return (
        <div className="flex flex-wrap gap-6 p-4 h-full">
            <Card className="flex-1 md:w-1/3 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">My Events</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search event name..."
                    className="border rounded-md p-2 mb-4 w-full"
                />
                <Button className="mb-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-md">
                    Search Event Name
                </Button>
                <h2 className="text-lg font-bold">Interview Stats</h2>
                <p className="mt-2">Total Meetings Done: {/* Placeholder */}</p>
                <p className="mt-2">Total Meetings Left: {/* Placeholder */}</p>
            </Card>

            <Card className="md:w-2/3 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Click to view</h2>

                {filteredNotes.length === 0 ? (
                    <CardDescription>No notes available. Create a new note!</CardDescription>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {filteredNotes.map((note) => (
                            <Link key={note.id} href={`/event/notes/view?eventCode=${note.eventCode}`}>
                                <Card className="p-4 hover:shadow-lg transition duration-300 cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">{note.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{note.description}</CardDescription>
                                        <small className="text-gray-500 block mt-2">
                                            Start Date: {formatDate(note.startDate)}
                                        </small>
                                        <small className="text-gray-500 block mt-2">
                                            End Date: {formatDate(note.endDate)}
                                        </small>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

// Function to format date strings
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', { timeZone: 'UTC' });
};
