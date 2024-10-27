import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; // Adjust the import path as necessary

interface Note {
    id: number;
    title: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

export function ViewNotes() {
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            try {
                const parsedNotes = JSON.parse(storedNotes);
                if (Array.isArray(parsedNotes)) {
                    setNotes(parsedNotes);
                } else {
                    console.error('Stored notes are not in the expected format.');
                }
            } catch (error) {
                console.error('Error parsing notes from local storage:', error);
            }
        }
    }, []);

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your Notes for All Events</CardTitle>
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
