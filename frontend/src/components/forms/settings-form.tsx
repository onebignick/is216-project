"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectValue, SelectItem, SelectTrigger } from "../ui/select";
import { Button } from "../ui/button";
import { MeetgridEvent } from "@/server/entity/event";

const formSchema = z.object({
    // eventName: z.string(),
    // description: z.string(),
    // startDate: z.date(),
    // endDate: z.date(),
    startHour: z.coerce.number(),
    startMinute: z.coerce.number(),
    endHour: z.coerce.number(),
    endMinute: z.coerce.number(),
    // participantNum: z.string(),
    // reminder:  z.string().optional(), // New field for reminder
})

interface SettingsFormInterface {
    event: MeetgridEvent;
}

export function SettingsForm({ event } : SettingsFormInterface) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const startTime = values.startHour * 60 + values.startMinute;
        const endTime = values.endHour * 60 + values.endMinute;

        const newEvent = {...event};
        newEvent.startTime = startTime;
        newEvent.endTime = endTime;

        const res = await fetch("/api/event", {
            method: "PUT",
            body: JSON.stringify({
                updatedEvent: newEvent
            })
        })       
        const response = await res.json();
        console.log(response);
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg">
                <Card>
                    <CardHeader>
                        <CardTitle>Event Start Time</CardTitle>
                        <CardDescription>Your event start time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="startHour"
                            render={({field}) => (
                                <FormItem className="col-span-1">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="select start hour"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">00</SelectItem>
                                            <SelectItem value="1">01</SelectItem>
                                            <SelectItem value="2">02</SelectItem>
                                            <SelectItem value="3">03</SelectItem>
                                            <SelectItem value="4">04</SelectItem>
                                            <SelectItem value="5">05</SelectItem>
                                            <SelectItem value="6">06</SelectItem>
                                            <SelectItem value="7">07</SelectItem>
                                            <SelectItem value="8">08</SelectItem>
                                            <SelectItem value="9">09</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="11">11</SelectItem>
                                            <SelectItem value="12">12</SelectItem>
                                            <SelectItem value="13">13</SelectItem>
                                            <SelectItem value="14">14</SelectItem>
                                            <SelectItem value="15">15</SelectItem>
                                            <SelectItem value="16">16</SelectItem>
                                            <SelectItem value="17">17</SelectItem>
                                            <SelectItem value="18">18</SelectItem>
                                            <SelectItem value="19">19</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="21">21</SelectItem>
                                            <SelectItem value="22">22</SelectItem>
                                            <SelectItem value="23">23</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startMinute"
                            render={({field}) => (
                                <FormItem className="col-span-1">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="select start minute"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">00</SelectItem>
                                            <SelectItem value="15">15</SelectItem>
                                            <SelectItem value="30">30</SelectItem>
                                            <SelectItem value="60">45</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Event End Time</CardTitle>
                        <CardDescription>Your event end time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="endHour"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="select end hour"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">00</SelectItem>
                                            <SelectItem value="1">01</SelectItem>
                                            <SelectItem value="2">02</SelectItem>
                                            <SelectItem value="3">03</SelectItem>
                                            <SelectItem value="4">04</SelectItem>
                                            <SelectItem value="5">05</SelectItem>
                                            <SelectItem value="6">06</SelectItem>
                                            <SelectItem value="7">07</SelectItem>
                                            <SelectItem value="8">08</SelectItem>
                                            <SelectItem value="9">09</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="11">11</SelectItem>
                                            <SelectItem value="12">12</SelectItem>
                                            <SelectItem value="13">13</SelectItem>
                                            <SelectItem value="14">14</SelectItem>
                                            <SelectItem value="15">15</SelectItem>
                                            <SelectItem value="16">16</SelectItem>
                                            <SelectItem value="17">17</SelectItem>
                                            <SelectItem value="18">18</SelectItem>
                                            <SelectItem value="19">19</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="21">21</SelectItem>
                                            <SelectItem value="22">22</SelectItem>
                                            <SelectItem value="23">23</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endMinute"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="select end minute"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">00</SelectItem>
                                            <SelectItem value="15">15</SelectItem>
                                            <SelectItem value="30">30</SelectItem>
                                            <SelectItem value="60">45</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}