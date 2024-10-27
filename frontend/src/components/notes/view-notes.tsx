// src/components/notes/ViewNotes.tsx

"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; // Adjust the import path as necessary

interface Note {
    id: number;
    title: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

export function NotesDisplay() {
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            setNotes(JSON.parse(storedNotes));
        }
    }, []);

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    {notes.length === 0 ? (
                        <CardDescription>No notes available. Create a new note!</CardDescription>
                    ) : (
                        <ul className="space-y-4">
                            {notes.map((note) => (
                                <li key={note.id}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{note.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>{note.content}</CardDescription>
                                            <small className="text-gray-500">Created by: {note.createdBy}</small>
                                            <br />
                                            <small className="text-gray-500">Created at: {new Date(note.createdAt).toLocaleString()}</small>
                                        </CardContent>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
