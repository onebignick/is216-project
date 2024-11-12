"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Loader2 } from "lucide-react";
import { MeetgridQuestion } from "@/server/entity/MeetgridQuestion";
import { MeetgridAnswer } from "@/server/entity/MeetgridAnswer";
import { useToast } from "@/hooks/use-toast";

interface InterviewAnswerFormProps {
    questions: MeetgridQuestion[];
    interviewId: string;
}

export function InterviewAnswerForm({ questions, interviewId }: InterviewAnswerFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [answers, setAnswers] = useState<MeetgridAnswer[]>();
    const { toast } = useToast(); 

    const formSchemaObject: { [key: string]: z.ZodString } = {};
    questions.forEach((question) => {
        formSchemaObject[question.id!] = z.string();
    });

    const formSchema = z.object(formSchemaObject);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        async function fetchAnswers() {
            const response = await fetch("/api/answer?" + new URLSearchParams({ interviewId }));
            const { meetgridAnswers } = await response.json();
            setAnswers(meetgridAnswers)

            const defaultValues: { [key: string]: string } = {};
            meetgridAnswers.forEach((answer: MeetgridAnswer) => {
                defaultValues[answer.questionId as string] = answer.answer;
            });

            // Reset form values to the dynamically fetched defaults
            form.reset(defaultValues);
        }

        fetchAnswers();
    }, [interviewId, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const requests = questions.map(async (question) => {
            const answerData: MeetgridAnswer = {
                questionId: question.id as string,
                interviewId,
                answer: values[question.id as string],
            };
            
            if (answers) {
                for (let i=0;i<answers!.length;i++) {
                    if (answers[i].questionId === question.id) {
                        answerData.id=answers[i].id;
                    }
                }
            }
            console.log(answerData);

            const method = answerData.id ? "PUT" : "POST";
            await fetch("/api/answer", {
                method,
                body: JSON.stringify(answerData),
            });
        });

        await Promise.all(requests);
        setIsLoading(false);

        toast({
            title: "Notes Saved!",
            description: "Your notes have been saved successfully.",
            className: "bg-green-500 text-black",
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {questions.map((question, idx) => (
                    <FormField
                        control={form.control}
                        name={question.id as string}
                        key={idx}
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>{idx + 1}. {question.title}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter response here" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button type="submit" disabled={isLoading} className="col-span-2 bg-coral text-black hover:bg-coral/70">
                    {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
