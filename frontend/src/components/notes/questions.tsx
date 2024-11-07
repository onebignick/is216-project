"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Question {
    key: string;
    prompt: string;
    answer?: string;
}

interface eventQuestionsProps {
    eventId: string; // Add the eventId prop here
    eventQuestions: Question[];
    onSaveQuestions: (questions: Question[]) => void; // Pass function to save questions to the database
}


export function InterviewQuestions({ eventQuestions, onSaveQuestions }: eventQuestionsProps) {
    const [questions, setQuestions] = useState<Question[]>(eventQuestions.map((q) => ({
        key: q.key,
        prompt: q.prompt,
    })));
    const [newQuestion, setNewQuestion] = useState("");
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editedPrompt, setEditedPrompt] = useState("");

    // Function to add a new question
    const handleAddQuestion = () => {
        if (newQuestion.trim() !== "") {
            const newQ: Question = { key: `${Date.now()}`, prompt: newQuestion.trim() };
            setQuestions([...questions, newQ]);
            setNewQuestion("");
        }
    };

    // Function to handle drag end and update order
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedQuestions = Array.from(questions);
        const [reorderedItem] = reorderedQuestions.splice(result.source.index, 1);
        reorderedQuestions.splice(result.destination.index, 0, reorderedItem);

        setQuestions(reorderedQuestions);
    };

    // Function to delete a question
    const handleDeleteQuestion = (key: string) => {
        setQuestions(questions.filter((q) => q.key !== key));
    };

    // Function to start editing a question
    const handleEditQuestion = (key: string, prompt: string) => {
        setEditingKey(key);
        setEditedPrompt(prompt);
    };

    // Function to save the edited question
    const handleSaveEdit = () => {
        setQuestions(questions.map((q) => q.key === editingKey ? { ...q, prompt: editedPrompt } : q));
        setEditingKey(null);
        setEditedPrompt("");
    };

    // Function to save questions to the database
    const handleSaveToDatabase = async () => {
        try {
            const response = await fetch(`/api/questions/save/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questions }), // Send the questions array
            });
    
            if (response.ok) {
                console.log('Questions saved successfully');
            } else {
                console.error('Failed to save questions');
            }
        } catch (error) {
            console.error('Error saving questions', error);
        }
    };
    
     

    return (
        <div className="relative p-6 h-screen flex flex-col space-y-6">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Interview Questions</CardTitle>
                    <CardDescription>Add, reorder, edit, and save questions for the interview.</CardDescription>
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
                    </div>

                    {/* Drag and Drop for Reordering Questions */}
                    <DragDropContext onDragEnd={handleOnDragEnd}>
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
                                                    className="bg-gray-100 p-2 rounded-md shadow-sm flex justify-between items-center"
                                                >
                                                    {editingKey === question.key ? (
                                                        <div className="flex items-center space-x-2">
                                                            <Input
                                                                type="text"
                                                                value={editedPrompt}
                                                                onChange={(e) => setEditedPrompt(e.target.value)}
                                                            />
                                                            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                                                        </div>
                                                    ) : (
                                                        <span>{question.prompt}</span>
                                                    )}
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" onClick={() => handleEditQuestion(question.key, question.prompt)}>Edit</Button>
                                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteQuestion(question.key)}>Delete</Button>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleSaveToDatabase}>Save Questions</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
