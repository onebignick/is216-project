// src/components/notes/ViewNotes.tsx

"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; 
import { Button } from "../ui/button";
import Link from "next/link";
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
        const storedNotes = localStorage.getItem('notes');
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
        <div className="flex min-h-screen">
            {/* Increased the width of Interview Stats to one-third */}
            <div className="w-1/3 bg-gray shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Interview Stats</h2>
                <p className="mt-2">Total Interviews Left: </p>
            </div>

            {/* Increased the flex-grow of the main content */}
            <div className="w-2/3 bg-gray shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Your Notes</h1>
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                
                {notes.length === 0 ? (
                    <CardDescription>No notes available. Create a new note!</CardDescription>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {filteredNotes.map((note) => (
                            <Card key={note.id} className="hover:shadow-lg transition duration-300 cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{note.content}</CardDescription>
                                    <small className="text-gray-500 block mt-8">
                                        {new Date(note.createdAt).toLocaleString()}
                                    </small>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Adjusted button to remain on the bottom of the main content */}
            <div className="flex mt-auto mr-auto">
                <Button>
                    <Link href="/event/notes/create">Create Note</Link>
                </Button>
            </div>
        </div>
    );
}
