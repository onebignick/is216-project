"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from 'next/navigation'

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
    const { eventId } = useParams();
    const [questions, setQuestions] = useState<Question[]>(eventQuestions);
    const [newQuestion, setNewQuestion] = useState("");
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editedPrompt, setEditedPrompt] = useState("");
  
    const handleAddQuestion = () => {
      if (!newQuestion.trim()) return;
      const newQ: Question = { key: `${Date.now()}`, prompt: newQuestion.trim() };
      setQuestions([...questions, newQ]);
      setNewQuestion("");
    };
  
    const handleOnDragEnd = (result: any) => {
      if (!result.destination) return;
      const reorderedQuestions = Array.from(questions);
      const [reorderedItem] = reorderedQuestions.splice(result.source.index, 1);
      reorderedQuestions.splice(result.destination.index, 0, reorderedItem);
      setQuestions(reorderedQuestions);
    };
  
    const handleDeleteQuestion = (key: string) => {
      setQuestions(questions.filter((q) => q.key !== key));
    };
  
    const handleEditQuestion = (key: string, prompt: string) => {
      setEditingKey(key);
      setEditedPrompt(prompt);
    };
  
    const handleSaveEdit = () => {
      setQuestions(
        questions.map((q) =>
          q.key === editingKey ? { ...q, prompt: editedPrompt } : q
        )
      );
      setEditingKey(null);
      setEditedPrompt("");
    };
  
    const handleSaveToDatabase = async () => {
        try {
            if (!eventId) {
                console.error("Event ID is missing");
                return;
            }
    
            const payload = { eventId, questions };  // Explicitly include eventId
            console.log("Payload being sent:", payload);  // Log the payload to verify
    
            const response = await fetch(`/api/questions/save/${eventId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                console.log("Questions saved successfully");
            } else {
                const errorText = await response.text();
                console.error("Failed to save questions:", errorText);
            }
        } catch (error) {
            console.error("Error saving questions:", error);
        }
    };
     

    return (
        <div className="p-6 h-screen flex flex-col space-y-6">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Interview Questions</CardTitle>
            <CardDescription>Manage questions for the interview.</CardDescription>
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
