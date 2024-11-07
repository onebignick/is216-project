"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MeetgridBookEvent } from "@/server/entity/booking";

// Define the structure for Question
interface Question {
  key: string;
  prompt: string;
  answer?: string;
}

interface InterviewNotesProps {
  participantsInformation: MeetgridBookEvent[];
  questions: Question[]; // Using the Question type for questions prop
}

export function InterviewNotes({ participantsInformation, questions }: InterviewNotesProps) {
  // Default empty array if questions is undefined or null
  const safeQuestions = questions || [];

  // Check if participants exist
  const hasParticipants = participantsInformation && participantsInformation.length > 0;

  // Helper function to format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

   // Helper function to format time (in minutes since midnight) into AM/PM format
   const formatTime = (minutes: number | null) => {
    if (minutes === null) return '';
    const hours = Math.floor(minutes / 60);
    const minutesRemaining = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutesRemaining < 10 ? `0${minutesRemaining}` : minutesRemaining;

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };


  return (
    <div className="relative p-6 h-screen flex flex-col space-y-6">
      {hasParticipants ? (
        <Table className="table-auto border-collapse w-full mb-8">
          <TableHeader>
            <TableRow>
              <TableHead className="border px-4 py-2">Name</TableHead>
              <TableHead className="border px-4 py-2">Date</TableHead>
              <TableHead className="border px-4 py-2">Interview Timing</TableHead>
              {safeQuestions.length > 0 && (
                <>
                  {/* Loop through questions only if there are any */}
                  {safeQuestions.map((q) => (
                    <TableHead key={q.key} className="border px-4 py-2">
                      {q.prompt}
                    </TableHead>
                  ))}
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {participantsInformation.map((participant, index) => (
              <TableRow key={index}>
                <TableCell className="border px-4 py-2">{participant.name}</TableCell>
                <TableCell className="border px-4 py-2">{formatDate(participant.date)}</TableCell>
                <TableCell className="border px-4 py-2">{formatTime(participant.startTime ?? null)}</TableCell>
                {safeQuestions.map((q) => (
                  <TableCell key={q.key} className="border px-4 py-2">
                    {q.answer || ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p>No participants yet. Invite people to join your event.</p>
          <Button className="mt-4">Add Participants</Button>
        </div>
      )}
    </div>
  );
}
