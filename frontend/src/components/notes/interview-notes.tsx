"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MeetgridBookEvent } from "@/server/entity/booking"; // need to change the name

// Types for event and booking events
interface Question {
    key: string;
    prompt: string;
    answer?: string;
}

// Types for event and booking events
interface Event {
    id?: string ;
    name: string | null;
    date: string | null;
    time: Date | null;
    status: string;
    questions?: Question[]; // Add questions property
}


interface participantsInformationProps {
    participantsInformation: MeetgridBookEvent;
}


export function InterviewNotes({ participantsInformation }: participantsInformationProps) {


    return (
        <div className="relative p-6 h-screen flex flex-col">


            
            Testing       
        
        </div>
    );
};

