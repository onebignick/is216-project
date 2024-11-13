"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Router } from "lucide-react";
import { MeetgridQuestion } from "@/server/entity/MeetgridQuestion";
import { usePathname, useRouter } from "next/navigation";

const formSchema = z.object({
    title: z.string(),
})

interface CreateQuestionFormProps {
    eventId: string,
    length: number,
}

export function CreateQuestionForm({ eventId, length }: CreateQuestionFormProps) {
    
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const questionToCreate = {
            eventId: eventId,
            title: values.title,
            order: length+1,
        } as MeetgridQuestion;

        await fetch("/api/question", {
            method: "POST", 
            body: JSON.stringify(questionToCreate),
        });

        toast({
            title: "Question Successfully created!",
            className: "bg-green-500 text-black",
        })
        
        setIsLoading(false);
        router.push(pathname);
        router.refresh();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem className="col-span-2">
                            <FormControl>
                                <Input placeholder="Enter question here" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                { 
                    !isLoading ? 
                        <Button type="submit" className="col-span-2 bg-coral text-black hover:bg-coral/70">
                            Add question
                        </Button>
                    :
                        <Button disabled className="col-span-2 bg-coral text-black hover:bg-coral/70">
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button>
                }
            </form>
        </Form>
    )
}