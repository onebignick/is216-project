"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import SearchBar from "@/components/ui/searchbar";

interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

export function NotesDisplay() {
    const [notes, setNotes] = useState<Note[]>([
        { id: 1, title: "Event 1", content: "This is the first sample note content.", createdAt: new Date().toISOString() },
        { id: 2, title: "Event 2", content: "This is the second sample note content.", createdAt: new Date().toISOString() },
        { id: 3, title: "Event 3", content: "This is the third sample note content.", createdAt: new Date().toISOString() },
        { id: 4, title: "Event 4", content: "This is the fourth sample note content.", createdAt: new Date().toISOString() },
        { id: 5, title: "Event 5", content: "This is the fifth sample note content.", createdAt: new Date().toISOString() },
        { id: 6, title: "Event 6", content: "This is the sixth sample note content.", createdAt: new Date().toISOString() },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedNotes = localStorage.getItem("notes");
        if (storedNotes) {
            try {
                const parsedNotes = JSON.parse(storedNotes);
                if (Array.isArray(parsedNotes)) {
                    setNotes(parsedNotes);
                }
            } catch (error) {
                console.error("Error parsing notes:", error);
            }
        }
    }, []);

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-wrap gap-6 p-4 h-full">
                <Card className="flex-1 w-1/3 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">My Events</h2>
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                <Button className="mb-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-md">
                    Search Event Name
                </Button>
                    <br/><br/><hr/><br/>
                    <h2 className="text-lg font-bold">Interview Stats</h2>
                    <p className="mt-2">Total Meetings Done: </p>
                    <p className="mt-2">Total Meetings Left: </p>
                </Card>

                <Card className="w-2/3 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Click to view</h2>
                    
                    {filteredNotes.length === 0 ? (
                        <CardDescription>No notes available. Create a new note!</CardDescription>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {filteredNotes.map((note) => (
                                <Link key={note.id} href={`/event/notes/view?id=${note.id}`}>
                                    <Card className="p-4 hover:shadow-lg transition duration-300 cursor-pointer">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>{note.content}</CardDescription>
                                            <small className="text-gray-500 block mt-2">
                                                {new Date(note.createdAt).toLocaleString()}
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