"use client";

import { useState } from "react";
import Link from "next/link";
//import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
import { MeetgridBookEvent } from "@/server/entity/booking";
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    time: Date | null;
    status: string;
    questions?: Question[];
}

interface participantsInformationProps {
    participantsInformation: MeetgridBookEvent[];
}

export function InterviewNotes({ participantsInformation }: participantsInformationProps) {
    const hasParticipants = participantsInformation && participantsInformation.length > 0;

    //const [questions, setQuestions] = useState<Question[]>([]);
    //const [newQuestion, setNewQuestion] = useState("");

    // Function to add a new question
    // const handleAddQuestion = () => {
    //     if (newQuestion.trim() !== "") {
    //         setQuestions([...questions, { key: `${Date.now()}`, prompt: newQuestion.trim() }]);
    //         setNewQuestion("");
    //     }
    // };

    // Function to handle drag end and update order
    // const handleOnDragEnd = (result) => {
    //     if (!result.destination) return; // If dropped outside the list, do nothing

    //     const reorderedQuestions = Array.from(questions);
    //     const [reorderedItem] = reorderedQuestions.splice(result.source.index, 1);
    //     reorderedQuestions.splice(result.destination.index, 0, reorderedItem);

    //     setQuestions(reorderedQuestions); // Update questions with the new order
    // };

    return (
        <div className="relative p-6 h-screen flex flex-col space-y-6">
            {hasParticipants ? (
                <Table className="table-auto border-collapse w-full mb-8">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border px-4 py-2">Name</TableHead>
                            <TableHead className="border px-4 py-2">Date</TableHead>
                            <TableHead className="border px-4 py-2">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participantsInformation.map((participant, index) => (
                            <TableRow key={index}>
                                <TableCell className="border px-4 py-2">{participant.name}</TableCell>
                                <TableCell className="border px-4 py-2">{participant.date}</TableCell>
                                <TableCell className="border px-4 py-2">{participant.time?.toString()}</TableCell>
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

            {/* Section for adding and reordering interview questions */}
            {/* <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Interview Questions</CardTitle>
                    <CardDescription>Add and reorder questions to ask participants during the interview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Input
                            type="text"
                            placeholder="Type a question"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                        />
                        <Button onClick={handleAddQuestion}>Add Question</Button>
                    </div> */}

                    {/* Drag and Drop for Reordering Questions */}
                    {/* <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="questions">
                            {(provided) => (
                                <ul
                                    className="mt-4 list-disc pl-5 space-y-2"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {questions.map((question, index) => (
                                        <Draggable key={question.key} draggableId={question.key} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-gray-100 p-2 rounded-md shadow-sm"
                                                >
                                                    {question.prompt}
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </CardContent>
            </Card> */}
        </div>
    );
}
