"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface ViewNotePageProps {
    bookingEvents: Event[]; // Accept bookingEvents as a prop
}

export function ViewNotePage({ bookingEvents }: ViewNotePageProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [eventFilters, setEventFilters] = useState<{ [key: string]: boolean }>({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Initialize eventFilters dynamically based on bookingEvents
    // Simulating data fetching
    useEffect(() => {
        const fetchData = async () => {
            // Simulate loading time
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating a delay of 1 second
            setIsDataLoaded(true);
            setIsLoading(false);
        };
        fetchData();
    }, []);

        // Format date to DD/MM/YYYY
    const formatDateToDDMMYYYY = (date: Date | null): string => {
        if (!date) return "N/A"; // Handle null cases
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Log booking data
    useEffect(() => {
        console.log("Booking data:", bookingEvents);
    }, [bookingEvents]);

    // Handle event click to open modal
    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    // Initialize eventFilters dynamically based on bookingEvents
    useEffect(() => {
        const initialFilters = bookingEvents.reduce((acc, event) => {
            if (event.id) {
                acc[event.id] = false; // Initialize all filters to false
            }
            return acc;
        }, {} as { [key: string]: boolean });

        setEventFilters(initialFilters);
    }, [bookingEvents]);
    
    // Handle checkbox changes for filtering events
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setEventFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked,
        }));
    };
    


    // Flatten the bookingEvents array
    const flatBookingEvents = bookingEvents.flat();

    // Apply search and filter criteria to the flattened array
    const filteredEvents = flatBookingEvents.filter((event) => {
        // Check if the event name matches the search term (ignoring case)
        const matchesSearchTerm =
            event.name && event.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Check if any of the filters are checked
        const anyFiltersChecked = Object.values(eventFilters).some((checked) => checked);

        // If no filters are checked, show all events; otherwise, check if the event matches the selected filters
        const matchesFilter = !anyFiltersChecked || eventFilters[event.id as string];

        // Return true if the event matches both the search term and filter criteria
        return matchesSearchTerm && matchesFilter;
    });
        
    // Populate event filters from booking events
    useEffect(() => {
        const initialFilters: { [key: string]: boolean } = {};
        bookingEvents.forEach((event) => {
            if (event.id) {
                initialFilters[event.id] = false; // Initialize each event id with false
            }
        });
        setEventFilters(initialFilters);
    }, [bookingEvents]);

    // Handle input change for event questions
    const handleInputChange = (eventId: string, questionKey: string, value: string) => {
        if (selectedEvent && selectedEvent.id === eventId) {
            setSelectedEvent((prev) => ({
                ...prev!,
                questions: {
                    ...prev!.questions,
                    [questionKey]: value,
                },
            }));
        }
    };

    // Filter events based on the search query and selected filters
    const filteredEvents = bookingEvents.filter((event) =>
        event.name !== null && event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(filteredEvents);


    return (
        <div className="relative p-6 h-screen flex flex-col">
            {/* Go Back Button */}
            <Button variant="outline" className="absolute top-6 left-6 bg-black text-white hover:bg-gray-800 transition duration-200 rounded-md">
                <Link href="/event/notes">Go Back</Link>
            </Button>
            {isLoading ? ( // Display loading indicator if loading
                <div className="flex items-center justify-center py-4">
                    <p className="text-gray-500">Loading events...</p>
                        </div>
            ) : (
                <div className="flex flex-wrap gap-6 mt-16 flex-grow">
                    {/* My Events Card */}
                    <Card className="flex-1 bg-white shadow-lg rounded-lg p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Person</h2>
                        <Input
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <Button type="submit" className="mb-4 w-full bg-black text-white hover:bg-gray-800 transition duration-200 rounded-md">
                            Search
                        </Button>

                        <h3 className="font-bold text-md mb-2">Filter participants:</h3>
                        <div className="space-y-2">
                        {flatBookingEvents.map((event) => (
                            <label key={event.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={event.id as string} // Ensure name is a string
                                    checked={eventFilters[event.id as string] ?? false} // Use nullish coalescing
                                    onChange={handleCheckboxChange}
                                    className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
                                />
                                <span className="text-gray-700">{event.name || "Unknown Event"}</span>
                            </label>
                        ))}
                        </div>
                    </Card>

                    {/* Event Details Card */}
                    <Card className="flex-2 bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-120px)] overflow-y-auto w-3/4">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">{selectedEvent ? `${selectedEvent.name} Details` : 'Event Details'}</CardTitle>
                        {/* {selectedEvent && <CardDescription className="text-gray-500">{selectedEvent.description}</CardDescription>} */}
                    </CardHeader>
                    <CardContent>

                                <Table className="mt-4">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {filteredEvents.length > 0 ? (
                                            filteredEvents.map((event) => (
                                                <TableRow key={event.id} onClick={() => handleEventClick(event)}>
                                                    <TableCell>{event.name}</TableCell>
                                                    <TableCell>{formatDateToDDMMYYYY(new Date(event.date ?? 0))}</TableCell>
                                                    <TableCell>{event.time ? event.time.toLocaleTimeString() : "N/A"}</TableCell>
                                                    <TableCell>{event.status}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-4">
                                                    No participants found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            
                        </CardContent>
                </Card>


                 {/* Event Detail Modal */}
                <EventDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={selectedEvent} />

                </div>
            )}
        </div>
    );
};

//Modal Component
const EventDetailModal = ({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: Event | null }) => {
    const [questions, setQuestions] = useState<Question[]>(event?.questions || []);
    const [newQuestionPrompt, setNewQuestionPrompt] = useState<string>(""); // For new question prompt
    const [newAnswer, setNewAnswer] = useState<string>(""); // For optional answer
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (event) {
            setQuestions(event.questions || []);
            const initialAnswers = (event.questions || []).reduce((acc, question) => {
                acc[question.key] = question.answer || "";
                return acc;
            }, {} as { [key: string]: string });
            setAnswers(initialAnswers);
        }
    }, [event]);

    // Function to add a new question with or without an answer
    const handleAddQuestion = () => {
        if (!newQuestionPrompt.trim()) return; // Only add if question prompt is filled

        const newQuestion: Question = {
            key: `question-${questions.length + 1}`,
            prompt: newQuestionPrompt,
            answer: newAnswer || "", // Answer is optional; defaults to an empty string
        };
        
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        setNewQuestionPrompt(""); // Clear question input
        setNewAnswer(""); // Clear answer input
    };

    const handleAnswerChange = (key: string, value: string) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        const updatedQuestions = questions.map((q) => ({
            ...q,
            answer: answers[q.key] || q.answer || "", // Save the updated answer if available
        }));

        // try {
        //     await axios.post("/api/save-questions", {
        //         eventId: event?.id,
        //         questions: updatedQuestions,
        //     });
        //     alert("Questions and answers saved successfully!");
        //     onClose(); // Close modal after saving
        // } catch (error) {
        //     console.error("Error saving questions:", error);
        //     alert("Failed to save questions.");
        // }
    };

    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-center flex-grow">{event.name} Details</h2>
                    <button 
                            onClick={onClose} 
                            className="text-gray-500 hover:text-gray-800"
                        >
                            &times;
                    </button>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Notes Taking:</h3>
                <br></br>
                    {/* Display each question with input for answers */}
                    {questions.map((question, index) => (
                        <div key={question.key} className="mb-4">
                            <label className="block font-semibold text-gray-700">
                                Question {index + 1}: {question.prompt}
                            </label>
                            <input
                                type="text"
                                value={answers[question.key] || question.answer}
                                onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                                className="mt-2 p-2 w-full border rounded-md"
                                placeholder="Type your answer here..."
                            />
                        </div>
                    ))}

                {/* Input for typing a new question and optional answer */}
                <input
                    type="text"
                    value={newQuestionPrompt}
                    onChange={(e) => setNewQuestionPrompt(e.target.value)}
                    className="mt-4 p-2 w-full border rounded-md"
                    placeholder="Type a new question prompt..."
                />
                <input
                    type="text"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="mt-2 p-2 w-full border rounded-md"
                    placeholder="Type the answer (optional)..."
                />
                <Button onClick={handleAddQuestion} className="mt-2 bg-blue-500 text-white">
                    Add Question
                </Button>

                <Button onClick={handleSave} className="mt-4 bg-green-500 text-white p-2 rounded-md">
                    Save Questions
                </Button>
            </div>
        </div>
    );
};

export default ViewNotePage;



// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// type EventFilters = {
//     event1: boolean;
//     event2: boolean;
//     event3: boolean;
//     event4: boolean; // Added event4
//     event5: boolean; // Added event5
//     event6: boolean; // Added event6
// };

// interface Event {
//     id: string;
//     name: string;
//     startDate: string;
//     endDate: string;
//     description: string;
//     questions: { [key: string]: string }; // Dynamic questions
// }

// const formatDateToDDMMYYYY = (date: Date): string => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
// };

// const ViewNotePage = () => {
//     const searchParams = useSearchParams();
//     const id = searchParams.get("id");
//     const [eventFilters, setEventFilters] = useState<EventFilters>({ event1: false, event2: false, event3: false, event4: false, event5:false, event6:false});
//     const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [events, setEvents] = useState<Event[]>([]);

//     // Mock event data (replace with actual data fetching)
//     const fetchEvents = () => {
//         // Replace this with your actual API call or data source
//         return [
//             {
//                 id: "1",
//                 name: "Event 1",
//                 startDate: "2024-10-30T10:00:00Z",
//                 endDate: "2024-10-30T12:00:00Z",
//                 description: "Description for Event 1",
//                 questions: { question1: "", question2: "" },
//             },
//             {
//                 id: "2",
//                 name: "Event 2",
//                 startDate: "2024-10-31T10:00:00Z",
//                 endDate: "2024-10-31T12:00:00Z",
//                 description: "Description for Event 2",
//                 questions: { question1: "", question2: "" },
//             },
//             {
//                 id: "3",
//                 name: "Event 3",
//                 startDate: "2024-10-31T10:00:00Z",
//                 endDate: "2024-10-31T12:00:00Z",
//                 description: "Description for Event 3",
//                 questions: { question1: "", question2: "" },
//             },
//             {
//                 id: "4",
//                 name: "Event 4",
//                 startDate: "2024-10-31T10:00:00Z",
//                 endDate: "2024-10-31T12:00:00Z",
//                 description: "Description for Event 4",
//                 questions: { question1: "", question2: "" },
//             },
//             {
//                 id: "5",
//                 name: "Event 5",
//                 startDate: "2024-10-31T10:00:00Z",
//                 endDate: "2024-10-31T12:00:00Z",
//                 description: "Description for Event 5",
//                 questions: { question1: "", question2: "" },
//             },
//             {
//                 id: "6",
//                 name: "Event 6",
//                 startDate: "2024-10-31T10:00:00Z",
//                 endDate: "2024-10-31T12:00:00Z",
//                 description: "Description for Event 6",
//                 questions: { question1: "", question2: "" },
//             },
//             // Add more events as needed
//         ];
//     };

//     useEffect(() => {
//         const fetchedEvents = fetchEvents();
//         setEvents(fetchedEvents);

//         // Set selected event based on id from URL
//         const event = fetchedEvents.find(event => event.id === id);
//         if (event) {
//             setSelectedEvent(event);
//         }
//     }, [id]);

//     const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = event.target;
//         setEventFilters((prev) => ({
//             ...prev,
//             [name]: checked,
//         }));
//     };

//     const handleEventClick = (event: Event) => {
//         setSelectedEvent({
//             ...event,
//             startDate: new Date(event.startDate).toLocaleString(),
//             endDate: new Date(event.endDate).toLocaleString(),
//         });
//         setIsModalOpen(true);
//     };

//     const handleInputChange = (id: string, questionKey: string, value: string) => {
//         setSelectedEvent((prevEvent) =>
//             prevEvent?.id === id
//                 ? { ...prevEvent, questions: { ...prevEvent.questions, [questionKey]: value } }
//                 : prevEvent
//         );
//     };

//     const filteredEvents = events?.filter((event) => {
//         if (eventFilters.event1 && event.name.includes("Person 1")) return true;
//         if (eventFilters.event2 && event.name.includes("Person 2")) return true;
//         if (eventFilters.event3 && event.name.includes("Person 3")) return true;
//         if (eventFilters.event4 && event.name.includes("Person 4")) return true; // Adjusted for event 4
//         if (eventFilters.event5 && event.name.includes("Person 5")) return true; // Adjusted for event 5
//         if (eventFilters.event6 && event.name.includes("Person 6")) return true; // Adjusted for event 6
//         return false;
//     }) || [];

//     return (
//         <div className="relative p-6 h-screen flex flex-col">
//             {/* Go Back Button */}
//             <Button variant="outline" className="absolute top-6 left-6 bg-black text-white hover:bg-gray-800 transition duration-200 rounded-md">
//                 <Link href="/event/notes">Go Back</Link>
//             </Button>
//             <div className="flex flex-wrap gap-6 mt-16 flex-grow">
//                 {/* My Events Card */}
//                 <Card className="flex-1 bg-white shadow-lg rounded-lg p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
//                     <h2 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Person</h2>
//                     <Input placeholder="Search" className="mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
//                     <Button type="submit" className="mb-4 w-full bg-black text-white hover:bg-gray-800 transition duration-200 rounded-md">
//                         Search
//                     </Button>

//                     <h3 className="font-bold text-md mb-2">Filter person:</h3>
//                     <div className="space-y-2">
//                     {["event1", "event2", "event3", "event4", "event5", "event6"].map((event) => (
//                         <label key={event} className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name={event}
//                                 checked={eventFilters[event as keyof EventFilters]}
//                                 onChange={handleCheckboxChange}
//                                 className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 transition duration-200 hover:bg-gray-200"
//                             />
//                             <span className="text-gray-700">{`Person ${event.charAt(5)}`}</span>
//                         </label>
//                     ))}
//                     </div>
//                 </Card>

//                 {/* Event Details Card */}
//                 <Card className="flex-2 bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-120px)] overflow-y-auto w-3/4">
//                     {selectedEvent && (
//                         <>
//                             <CardHeader>
//                                 <CardTitle className="text-xl font-semibold">{selectedEvent.name} Details</CardTitle>
//                                 <CardDescription className="text-gray-500">{selectedEvent.description}</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <Table className="mt-4">
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>Name</TableHead>
//                                             <TableHead>Timeslot</TableHead>
//                                             <TableHead>Status</TableHead>
//                                             {filteredEvents[0]?.questions && Object.keys(filteredEvents[0].questions).map((key) => (
//                                                 <TableHead key={key}>{key}</TableHead>
//                                             ))}
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {filteredEvents.map((event) => (
//                                             <TableRow key={event.id} onClick={() => handleEventClick(event)}>
//                                                 <TableCell>{event.name}</TableCell>
//                                                 <TableCell>{`${formatDateToDDMMYYYY(new Date(event.startDate))} - ${formatDateToDDMMYYYY(new Date(event.endDate))}`}</TableCell>
//                                                 <TableCell>Sample Status</TableCell>

//                                                 {Object.keys(event.questions).map((questionKey) => (
//                                                     <TableCell key={questionKey}>
//                                                         <input
//                                                             type="text"
//                                                             value={event.questions[questionKey]}
//                                                             onChange={(e) => handleInputChange(event.id, questionKey, e.target.value)}
//                                                             className="w-full p-1 border rounded"
//                                                         />
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </CardContent>
//                         </>
//                     )}
//                 </Card>

//                 {/* Event Detail Modal */}
//                 <EventDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={selectedEvent} />
//             </div>
//         </div>
//     );
// };

// export default ViewNotePage;

// // Modal Component
// const EventDetailModal = ({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: Event | null }) => {
//     if (!isOpen || !event) return null;

//     const startDate = new Date(event.startDate);
//     const endDate = new Date(event.endDate);

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg p-6 w-1/3">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold text-center flex-grow">{event.name}</h2>
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
//                         &times;
//                     </button>
//                 </div>
//                 <p>Starts: {startDate.toLocaleString()}</p>
//                 <p>Ends: {endDate.toLocaleString()}</p>
//                 <p>{event.description}</p>
//                 <button onClick={onClose} className="mt-4 w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600">
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// };
