"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MeetgridQuestions } from "@/server/entity/question";

interface Question {
    key: string;
    prompt: string;
    answer?: string;
}

interface eventQuestionsProps {
    eventQuestions: MeetgridQuestions[];
    onAddQuestion: (newQuestion: string) => void; // New prop for adding questions
}

export function InterviewQuestions({ eventQuestions }: eventQuestionsProps){

    const [questions, setQuestions] = useState<Question[]>(eventQuestions.map((q) => ({
        key: q.id.toString(),
        prompt: q.questionText,
    })));
    const [newQuestion, setNewQuestion] = useState("");

    // Function to add a new question
    const handleAddQuestion = () => {
        if (newQuestion.trim() !== "") {
            setQuestions([...questions, { key: `${Date.now()}`, prompt: newQuestion.trim() }]);
            setNewQuestion("");
        }
    };

    // Function to handle drag end and update order
    const handleOnDragEnd = (result) => {
        if (!result.destination) return; // If dropped outside the list, do nothing

        const reorderedQuestions = Array.from(questions);
        const [reorderedItem] = reorderedQuestions.splice(result.source.index, 1);
        reorderedQuestions.splice(result.destination.index, 0, reorderedItem);

        setQuestions(reorderedQuestions); // Update questions with the new order
        };


    return (
        <div className="relative p-6 h-screen flex flex-col space-y-6">
    {/* Section for adding and reordering interview questions */}
                <Card className="mt-4">
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
                </Card>
            </div>
        );
};

    //export default Questions;
