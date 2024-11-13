// @ts-nocheck
"use client"
import { MeetgridQuestion } from "@/server/entity/MeetgridQuestion";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface QuestionDisplayCardProps {
    eventId: string;
}

export function QuestionDisplayCard({ eventId }: QuestionDisplayCardProps) {
    
    const [questions, setQuestions] = useState<MeetgridQuestion[]>([])
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editedPrompt, setEditedPrompt] = useState("");
    const {toast} = useToast();

    useEffect(() => {
        async function handle() {
            const eventQuestionsResponse = await fetch("/api/question?" + new URLSearchParams({
                eventId: eventId
            }))

            const { targetQuestions } = await eventQuestionsResponse.json();
            setQuestions(targetQuestions);
        }
        handle();
    }, [])

    const handleOnDragEnd = async (result: any) => {
        if (!result.destination) return;
        // await fetch("/api/question", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         updatedQuestions: questions
        //     })
       // })
        const reorderedQuestions = Array.from(questions);
        const [reorderedItem] = reorderedQuestions.splice(result.source.index, 1);
        reorderedQuestions.splice(result.destination.index, 0, reorderedItem);
        await fetch("/api/question", {
            method: "PUT",
            body: JSON.stringify({
                updatedQuestions: reorderedQuestions
            })
        });
        setQuestions(reorderedQuestions)
    }

    const handleEditQuestion = (key: string, prompt: string) => {
        setEditingKey(key);
        setEditedPrompt(prompt);
    };

    const handleSaveEdit = async () => {
        console.log(questions, editingKey)
        const newQuestions = [...questions];
        for(let i=0;i<newQuestions.length;i++) {
            if (newQuestions[i].id == editingKey) {
                newQuestions[i].title = editedPrompt;
            }
        }
        setQuestions(newQuestions);
        setEditingKey(null);
        setEditedPrompt("");

        await fetch("/api/question", {
            method: "PUT",
            body: JSON.stringify({
                updatedQuestions: newQuestions,
            })
        });
    };

    const handleDeleteQuestion = async (questionIdToDelete: string) => {
        const deletedQuestionResponse = await fetch("/api/question", {
            method: "DELETE",
            body: JSON.stringify({
                questionIdToDelete: questionIdToDelete,
            })
        });
        if (deletedQuestionResponse.ok) {
            toast({
                title: "Question Successfully Deleted",
                className: "bg-green-500 text-black",
            })
            setQuestions(questions.filter((q) => q.id !== questionIdToDelete));
            return;
        }
        toast({
            title: "Failed to delete question...",
            className: "bg-red-500 text-black",
        })
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="questions">
                {(provided) => (
                  <ul
                    className="mt-4 list-disc pl-5 space-y-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-100 p-2 rounded-md shadow-sm flex justify-between items-center"
                          >
                            {editingKey === question.id ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="text"
                                  value={editedPrompt}
                                  onChange={(e) => setEditedPrompt(e.target.value)}
                                />
                                <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                              </div>
                            ) : (
                              <span>{question.title}</span>
                            )}
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => handleEditQuestion(question.id, question.title)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteQuestion(question.id)}>Delete</Button>
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
    )
}